const authService = require("../services/auth.service");
const { resetAdminPasswordValidation, forgotAdminPasswordValidation, otpValidator } = require('../validators');
const authenticateUser = require('@middleware/authenticateMiddleware');
const { sessionUserPermissions } = require('@middleware/permissionMiddleware');
const {logCrmEvents} = require('../helpers');
const { container } = require("@container");
const authController = container.resolve('authController');
const dashboardController = container.resolve('dashboardController');
const homeController = container.resolve('homeController');
const adminRoles = require('./roles');
const admins = require('./admins');
const email = require('./email');
const config = require('./configs');
const ipAccess = require('./ip-access');
const loginLogs = require('./login-logs');
const homePage = require('./home-page');
const aboutPage = require('./about-page');
const resume = require('./resume');
const portfolio = require('./portfolio');
const blog = require('./blog');
const contactInfo = require('./contact-info');

const {APIPREFIX} = require("@constant");
const apiRoutes = require('./api/index');
const { throttle} = require("@middleware");
module.exports = (app, passport) => {
    
    app.use(APIPREFIX, apiRoutes);

    app.get('/system', [authenticateUser.guest], authController.login);
    app.get('/system/login', [authenticateUser.guest], authController.login);
    app.post('/system/login',async (req, res, next) => {
        await passport.authenticate('local', async (err, user, info) => {
            if (user) {
                await Promise.all([
                    authService.storeLoginLogs(req),
                    authService.clearResetPasswordData(req)
                ]);
                logCrmEvents(req, "Event", "success", { message: "Login Successful" });
                return res.redirect('/system/home');
            } else {
                let msg = info && info.message ? info.message : 'Incorrect Email/Password';
                logCrmEvents(req, "Event", "error", { message: msg }, { error: err });
                req.flash('error_msg', msg);
                return res.redirect('/system/login');
            }
        })(req, res, next);
    });

    app.get('/system/home', [authenticateUser.isLoggedIn,sessionUserPermissions], dashboardController.index);
    app.get('/system/otp-verification', authController.optVerificationView);
    app.post('/system/otp-verification', [otpValidator], authController.optVerification);
    app.get('/system/resend-otp', authController.resendOtp);
    app.get('/system/forgot-password', authController.forgotPasswordView);
    app.post('/system/forgot-password',[forgotAdminPasswordValidation], authController.forgotPassword);
    app.get('/system/force/reset-password', authController.forceResetPasswordView);
    app.get('/system/reset-password/:token', authController.resetPasswordView);
    app.post('/system/reset-password/:token', [resetAdminPasswordValidation], authController.resetPassword);
    app.get('/system/logout', [authenticateUser.isLoggedIn], authController.logout);
    app.get('/system/home', [authenticateUser.isLoggedIn,sessionUserPermissions], dashboardController.index);
    app.use('/system/admin-roles', [authenticateUser.isLoggedIn,sessionUserPermissions], adminRoles);
    app.use('/system/admins', [authenticateUser.isLoggedIn,sessionUserPermissions], admins);
    app.use('/system/email-templates', [authenticateUser.isLoggedIn,sessionUserPermissions], email);
    app.use('/system/configs', [authenticateUser.isLoggedIn,sessionUserPermissions], config);
    app.use('/system/ip-access', [authenticateUser.isLoggedIn,sessionUserPermissions], ipAccess);
    app.use('/system/login-logs', [authenticateUser.isLoggedIn,sessionUserPermissions], loginLogs);
    app.use('/system/home-page', [authenticateUser.isLoggedIn,sessionUserPermissions], homePage);
    app.use('/system/about-page', [authenticateUser.isLoggedIn,sessionUserPermissions], aboutPage);
    app.use('/system/resume', [authenticateUser.isLoggedIn,sessionUserPermissions], resume);
    app.use('/system/portfolio', [authenticateUser.isLoggedIn,sessionUserPermissions], portfolio);
    app.use('/system/blog', [authenticateUser.isLoggedIn,sessionUserPermissions], blog);
    app.use('/system/contact-info', [authenticateUser.isLoggedIn,sessionUserPermissions], contactInfo);


    app.get('/', homeController.index);
    app.post('/system/send/email',[throttle({freeTries: 2, waitTime: 600})], homeController.sendEmail);
   

    app.get('*', function (req, res) {
        res.status(404);
        res.render('error/404', {
            layout: false,
            pageTitle: '400'
        });
    });
};