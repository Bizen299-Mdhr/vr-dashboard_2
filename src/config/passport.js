const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;

const {admin, user, role, userRole, clients, Token, apiUsers} = require('@models');

const { Op } = require("sequelize");
const { hasSuperAdminRole } = require("@lib");
const {token} = require("@config");

const verifyClient = (clientId, clientSecret, done) => {
    clients.findOne({ where: { id: clientId } }).then(client => {
        if (!client) { return done(null, false); }
        if (client.client_secret !== clientSecret) { return done(null, false); }
        return done(null, client);
    }).catch(err => {
        return done(err);
    });
};
module.exports = (passport) => {
    passport.serializeUser(function (user, done) {
        done(null, {id: user.id, user: user, role: user.role});
    });

    passport.deserializeUser(function (user, done) {
        done(null, {id: user.id, user: user, role: user.role});
    });

    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    }, function (req, username, password, done) {
        admin.findOne({
            where: {
                [Op.or]: [
                    {username: username},
                    {email: username}
                ]
            }, include: [{model: role, as: "role"}, {model: userRole, as: "userRoles"}]
        }).then(response => {
            if (response && response.dataValues && response.dataValues.email) {
                let adminUser = response.dataValues;
                if (adminUser) {
                    if(hasSuperAdminRole(adminUser)){
                        if (!admin.validPassword(password, adminUser.password)) {
                            return done(null, false, {message: 'Incorrect Email/Password'}, false);
                        }
                        req.session.user = response;
                        return done(null, adminUser);
                    }
                    if (adminUser.status === "active") {
                        if (!admin.validPassword(password, adminUser.password)) {
                            return done(null, false, {message: 'Incorrect Email/Password'}, false);
                        }
                        req.session.user = response;
                        return done(null, adminUser);
                    } else {
                        return done(null, false, {message: 'Your account is in in-active state.'}, false);
                    }
                } else {
                    return done(null, false, {message: 'Not authorized'}, false);
                }
            } else {
                return done(null, false, {message: 'Incorrect Email/Password'}, false);
            }
        });
    }));

    passport.use('local-login', new LocalStrategy((username, password, done) => {
        user.findOne({where: {'username': username}}, async (err, user) => {
            if (err) {
                return done(null, false, {error: err});
            }
            if (!user) {
                return done(null, false, {message: 'Account does not exist.'});
            }
            if (!user.validPassword(password)) {
                return done(null, false, {message: 'Username and Password do not match.'});
            }
            if (user.status !== 'active') {
                return done(null, false, {message: 'Your account is not active. Please contact administrator.'});
            }
            return done(null, user);
        });
    }));

    passport.use(new BearerStrategy(
        function (accessToken, done) {
            Token.findOne({ where: { accessToken } }).then(tokenData => {
                if (!tokenData) { return done(null, false); }
                if(tokenData.is_revoked) {return done(null, false, { message: 'Token has been black listed.' });}
                if (Math.round((Date.now() - tokenData.expiresAt) / 1000) > token.expiry) {
                    Token.destroy({ where: { accessToken } }).then(() => {
                        return done(null, false, { message: 'Token expired.' });
                    }).catch(err => {
                        return done(err);
                    });
                }
                apiUsers.findOne({
                    where: { id: tokenData.userId },
                    attributes: ['id','first_name', 'last_name', 'email']
                }).then(user => {
                    if (!user) {return done(null, false, { message: 'Unknown user' });}
                    return done(null, user, { scope: '*' });
                }).catch(err => {
                    return done(err);
                });
            }).catch(err => {
                return done(err);
            });
        }
    ));

    passport.use(new ClientPasswordStrategy(verifyClient));
};