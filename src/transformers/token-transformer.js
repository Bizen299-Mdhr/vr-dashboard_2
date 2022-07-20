class TokenTransformer {
    transformToken(tokenData){
        return transform(tokenData);
    }
}
module.exports = TokenTransformer;

const transform = (tokenData) => {
    return {
        type: tokenData?.type,
        expires_at: tokenData?.expiresAt,
        token: tokenData?.accessToken,
        refresh_token: tokenData?.refreshToken
    };
};
