require("module-alias/register");
const passport = require('passport');
const oauth2orize = require('oauth2orize');
const bcrypt = require('bcryptjs');

const { Token, apiUsers } = require('@models');
const {token} = require('@config');
const { generateToken } = require('@lib');

const server = oauth2orize.createServer();

// Create new token
const createToken = (client, user) => {
    const accessToken = generateToken(token.length);
    const refreshToken = generateToken(token.length);
    return Token.create({
        accessToken,
        refreshToken,
        clientId: client.id,
        userId: user.id,
        expiresAt: Date.now() + token.expiry
    });
};

server.exchange(oauth2orize.exchange.password(async function (client, username, password, scope, done) {
    try {
        const user = await apiUsers.findOne({ where: { email: username } });

        if (!user) { return done(null, false); }

        const compared = await bcrypt.compare(password, user.password);

        if(!compared){
            return done();

        }
        await Token.destroy({ where: { userId: user.id } });
        const tokenData = await createToken(client, user);

        done(null, tokenData.accessToken, tokenData.refreshToken, { 'expiry_time': token.expiry });
        return "test";
    } catch (e) {
        return done(e);
    }
}));

server.exchange(oauth2orize.exchange.refreshToken(async function (client, refreshToken, scope, done) {
    try {
        const tokenData = await Token.findOne({ where: { refreshToken } });

        if (!tokenData) { return done(null, false); }

        const user = await apiUsers.findOne({
            where:{
                id: tokenData.userId
            }
        });

        if (!user) { return done(null, false); }

        Token.destroy({ where: { userId: user.id } });
        
        const newToken = await createToken(client, user);
        done(null, newToken.accessToken, newToken.refreshToken, { 'expiry_time': token.expiry});
    } catch (e) {
        return done(e);
    }
}));

// token endpoint
module.exports.token = [
    passport.authenticate('oauth2-client-password', { session: false }),
    server.token(),
    server.errorHandler()
];
