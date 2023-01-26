const randtoken = require('rand-token');
const {logCrmEvents, randomValueBase64, bcryptPassword, getConfigData} = require('@lib');
const authService = require("../../../services/auth.service");
const moment = require("moment");
const {admin} = require("@models");
const {emitter} = require('@emitter');
const db = require("@db").postgres;
class AuthController {
    constructor({container, bindAll}) {
        this.container = container;
        bindAll(this, AuthController.prototype);
        this.service = container.resolve('adminService');
        this.emailService = container.resolve('emailService');
        this.title = 'Login';
    }

    async login(req, res) {
        if (req.session.user) {
            return res.redirect('/system/home');
        }
        let loginCount = 0;
        let remainingTime = 0;
        if (req.session.loginCount) {
            loginCount = req.session.loginCount;
        }
        if (req.session.lockoutTime) {
            const current = moment();
            const lockTime = moment(req.session.lockoutTime);
            remainingTime = lockTime.diff(current, 'minutes');
        }
        logCrmEvents(req, "Page Visit", "success", {message: "Login Page"});
        let showInactiveMsg = false;
        if(req.query.state == 'inactive'){
            showInactiveMsg = true;
        }
        return res.render('auth/login', {data: {sign: "ログイン"}, layout: false, loginCount, remainingTime, showInactiveMsg});
    }

    async logout(req, res) {
        if (req.session.user && req.session.user.otp_code) {
            await admin.update({otp_code: null}, {where: {_id: req.session.user._id}, individualHooks: true});
        }
        authService.storeLogoutLogs(req);
        await this.container.dispose();
        await req.session.destroy();
        logCrmEvents(req, "Event", "success", {message: "Logged Out"});
        return res.redirect('/system/login');
    }

    async forgotPasswordView(req, res) {
        if (req.session.user) {
            return res.redirect('/system/home');
        }
        logCrmEvents(req, "Page Visit", "success", {message: "Forgot Password Page"});
        return res.render('auth/forgot', {layout: false});
    }

    async forgotPassword(req, res) {
        let user = await this.service.findOne({where: {email: req.body.email}});
        if(user && user?.status !== "active"){
            req.flash('error_msg', 'Your account is in in-active state.');
            return res.redirect('/system/forgot-password');
        }
        if (user === null) {
            req.flash('success_msg', 'Password reset link is sent to your email.');
            return res.redirect('/system/forgot-password');
        }
        try {
            let token = randtoken.generate(10);
            let expiryHour = 24;
            if (getConfigData(req, "Password Reset Url Validity") && getConfigData(req, "Password Reset Url Validity") !== "") {
                expiryHour = getConfigData(req, "Password Reset Url Validity");
            }
            let expiryDate = moment().add(expiryHour, "hours");
            let updateData = {
                'reset_password_token': token,
                'reset_password_expires': expiryDate
            };
            await this.service.findOneAndUpdate({where: {email: req.body.email}}, updateData);

            emitter.emit('send-reset-link', {
                email: [req.body.email],
                code: 'forgot_password',
                username: user.username,
                token: token,
                url: process.env.CMSURL + /reset-password/ + token
            });


            req.flash('success_msg', 'Password reset link is sent to your email.');
            return res.redirect('/system/forgot-password');
        } catch (e) {
            req.flash('error_msg', e.message);
            return res.redirect('/system/forgot-password');
        }
    }

    async resetPasswordView(req, res) {
        if (req.session.user) {
            return res.redirect('/system/home');
        }
        let token = req.params.token;
        try {
            let currentDate = new Date();
            let user = await this.service.findOne({where: {'reset_password_token': token}});
            if (user && user.reset_password_token == token && currentDate < user.reset_password_expires) {
                logCrmEvents(req, "Page Visit", "success", {message: "Reset Password Page"});
                return res.render('auth/resetPassword', {layout: false, token: req.params.token});
            } else {
                req.flash('error_msg', 'Reset link is invalid or expired.');
                return res.redirect("/system/login");
            }
        } catch (e) {
            req.flash('error_msg', e.message);
            return res.redirect("/system/login");
        }
    }

    async resetPassword(req, res) {
        let token = req.params.token;
        let currentDate = new Date();
        const trx = await db.transaction();
        try {
            let user = await this.service.findOne({where: {'reset_password_token': token}});
           

            if(user && user?.status !== 'active'){
                await trx.rollback();
                req.flash('error_msg', 'Your account is in in-active state.');
                return res.redirect("back");
            }

            if (user && user.reset_password_token !== token) {
                req.flash('error_msg', 'Invalid Token');
                let url = '/system/login';
                if(req.body.force_reset){
                    url = "force/reset-password";
                }
                await trx.rollback();
                return res.redirect(url);
            }

            if (user && user.reset_password_expires !== null && currentDate > user.reset_password_expires) {
                req.flash('error_msg', 'Reset link is invalid or expired.');
                req.flash('error_msg', 'Invalid Token');
                let url = '/system/login';
                if(req.body.force_reset){
                    url = "/system/force/reset-password";
                }
                await trx.rollback();
                return res.redirect(url);
            }

            
            if(await this.service.checkRecentOldPasswords(req,token, req.body.password)){
                req.flash('error_msg', 'Current entered Password has been used already.Please enter new password!');
                let url = '/reset-password/' + token;
                if(req.body.force_reset){
                    url = "/system/force/reset-password";
                }
                await trx.rollback();
                return res.redirect(url);
            }

          
            let hashround = 10;
            if (getConfigData(req, "Password Hashing Rounds") && getConfigData(req, "Password Hashing Rounds") !== "") {
                hashround = parseInt(getConfigData(req, "Password Hashing Rounds"));
            }
            user = await this.service.findOneAndUpdate({where:{'reset_password_token': token}}, {
                password: bcryptPassword(req.body.password, hashround),
                'updated_at': new Date(),
                'reset_password_token': '',
                'reset_password_expires': null,
                'password_resetted': true,
                'password_resetted_date': new Date(),
                'status':'active',
                'show_reset_password': false
            }, trx);
            await this.service.storePasswordHistory({
                user_id: user[1][0]._id,
                password: user[1][0].password
            }, trx);
            if (req.session.user) {
                req.session.user.password_resetted = true;
                req.session.user.show_reset_password = false;
                req.session.user.password_resetted_date = new Date();
            }
            req.flash('success_msg', 'Password reset successful');
            logCrmEvents(req, "Event", "success", {message: "Password reset successful"});
            await trx.commit();
            return res.redirect('/system/login');
        } catch (e) {
            await trx.rollback();
            req.flash('error_msg', e.message);
            return res.redirect("/system/login");
        }
    }

    async forceResetPasswordView(req, res) {
        if (!req.session.user) {
            return res.redirect('/system/login');
        }
        try {
            let token = randtoken.generate(10);
            const forceReset = 1;
            let updateData = {
                'reset_password_token': token,
                'password_resetted': false
            };
            const user = await this.service.findOneAndUpdate({where: {email: req.session.user.email}}, updateData);
            const userToken = user?.[1]?.[0]?.reset_password_token;
            logCrmEvents(req, "Page Visit", "success", {message: "Force password Reset."});
            return res.render('auth/resetPassword', {layout: false, userToken, forceReset});
        } catch (e) {
            req.flash('error_msg', e.message);
            return res.redirect("/system/login");
        }
    }

    async optVerificationView(req, res) {
        if (!req.session.user) {
            return res.redirect('/system/login');
        }
        try {
            const check = await authService.refresh2FA(req);
            if (check) {
                return res.redirect('/system/home');
            }

            const otpCode = randomValueBase64(6);
            const user = await this.service.findOne({where: {'_id': req.session.user._id}});
            if (!user.otp_code) {
                let expiryTime = 15;
                if (getConfigData(req, "OTP Validity") && getConfigData(req, "OTP Validity") !== "") {
                    expiryTime = getConfigData(req, "OTP Validity");
                }
                expiryTime = moment().add(expiryTime, "minutes");

                await this.service.findOneAndUpdate({where: {'_id': req.session.user._id}}, {
                    otp_code: otpCode,
                    otp_code_expiration: expiryTime
                });
                req.session.user.otp_code = otpCode;
                emitter.emit('send-otp',
                    {
                        email: [user.email],
                        code: 'cms_otp_verification',
                        username: user.username,
                        otp_code: otpCode
                    }
                );

                req.session.user.otp_code = otpCode;
            }
            logCrmEvents(req, "Page Visit", "success", {message: "Otp verification page."});
            return res.render('auth/otpVerification', {layout: false});
        } catch (e) {
            req.flash('error_msg', e.message);
            return res.redirect("/system/otp-verification");
        }
    }

    async optVerification(req, res) {
        try {
            const currentDate = new Date();
            const user = await this.service.findOne({where: {'otp_code': req.body.otp_code}});
            if (!user) {
                req.flash('error_msg', 'Invalid Otp Code.');
                return res.redirect("/system/otp-verification");
            }

            if (user && user.otp_code_expiration !== null && currentDate > user.otp_code_expiration) {
                req.flash('error_msg', 'OTP code has been expired.');
                return res.redirect("/system/otp-verification");
            }

            await this.service.findOneAndUpdate({where: {'otp_code': req.body.otp_code}}, {
                otp_code: null,
                otp_code_expiration: null
            });
            req.session.user.otp_code = null;
            return res.redirect("/system/home");
        } catch (e) {
            req.flash('error_msg', e.message);
            return res.redirect("/system/otp-verification");
        }
    }

    async resendOtp(req, res) {
        try {
            const otpCode = randomValueBase64(6);
            let expiryTime = 15;
            if (getConfigData(req, "OTP Validity") && getConfigData(req, "OTP Validity") !== "") {
                expiryTime = getConfigData(req, "OTP Validity");
            }
            expiryTime = moment().add(expiryTime, "minutes");
            const user = await this.service.findOneAndUpdate({where: {'_id': req.session.user._id}}, {
                otp_code: otpCode,
                otp_code_expiration: expiryTime
            });
            emitter.emit('send-otp',
                {
                    email: [user[1][0].email],
                    code: 'cms_otp_verification',
                    username: user[1][0].username,
                    otp_code: otpCode
                }
            );

            logCrmEvents(req, "Event", "success", {message: "Otp Resent."});
            req.flash('success_msg', 'Otp Code Resent Successfully.');
            return res.redirect("/system/otp-verification");
        } catch (e) {
            req.flash('error_msg', e.message);
            return res.redirect("/system/otp-verification");
        }
    }
}

module.exports = AuthController;