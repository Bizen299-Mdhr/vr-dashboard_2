require("module-alias/register");
const http = require("http-status-codes");
const {RateLimiterRedis} = require("rate-limiter-flexible");
const {throttleConfig} = require("@config");
const {redisClient} = require('../../model/redis');
const { singleErrorFormat } = require('@errors');
const {isApiRequestOrAjax} = require("@lib");

const throttle = (payload = {}) => {
    if(Object.keys(payload).length === 0){
        payload = {
            freeTries: throttleConfig.freeTries || 2,
            waitTime: throttleConfig.waitTime || 600
        };
    }
    try {
        const rateLimiter = new RateLimiterRedis({
            storeClient: redisClient,
            keyPrefix: "middleware",
            points: payload.freeTries,
            duration: payload.waitTime
        });
        return (req, res, next) => {
            let key = req.ip;
            // if(payload?.key){
            //     key = `${req['body'][payload?.key[0]]}${req['body'][payload?.key[1]]}${req.ip}`;
            // }
            rateLimiter.consume(key)
                .then(() => {
                    return next();
                })
                .catch((redisError) => {
                    if (redisError instanceof Error) {
                        // Some Redis error
                        // Never happen if `insuranceLimiter` set up
                        // Decide what to do with it in other case
                    } else {
                        // Can't consume
                        // If there is no error, rateLimiterRedis promise rejected with number of ms before next request allowed
                        const minutes = Math.round(Math.round(redisError.msBeforeNext / 1000 /60) ) || 10;
                        if (isApiRequestOrAjax(req)) {
                            return res.status(http.StatusCodes.TOO_MANY_REQUESTS).json(singleErrorFormat({
                                statusCode : http.StatusCodes.TOO_MANY_REQUESTS,
                                msg: `Please try again after ${minutes} minutes.`
                            }));
                        }
                        req.flash('error_msg', 'Retry-After', String(minutes));
                        return res.redirect('/system/login');
                    }
                });
        };  
    } catch (error) {
        return (_req, _res, next) => {
            return next();
        };
    }
};
module.exports = {throttle};
