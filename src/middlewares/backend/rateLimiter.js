const {redisClient} = require('../../model/redis');
const {RateLimiterRedis} = require("rate-limiter-flexible");

let rateLimiterMiddleware;

try {
    const rateLimiter = new RateLimiterRedis({
        storeClient: redisClient,
        keyPrefix: "middleware",
        points: process.env.RATE_LIMIT_POINTS || 2, // 10 requests
        duration: process.env.RATE_LIMIT_DURATION || 30 // per 10 second by IP
    });
    rateLimiterMiddleware = (req, res, next) => {
        rateLimiter.consume(req.ip)
            .then(() => {
                next();
            })
            .catch((redisError) => {
                if (redisError instanceof Error) {
                    // Some Redis error
                    // Never happen if `insuranceLimiter` set up
                    // Decide what to do with it in other case
                } else {
                    // Can't consume
                    // If there is no error, rateLimiterRedis promise rejected with number of ms before next request allowed
                    const secs = Math.round(redisError.msBeforeNext / 1000) || 1;
                    req.flash('error_msg', 'Retry-After', String(secs));
                    return res.redirect('/login');
                }
            });
    };  
} catch (error) {
    rateLimiterMiddleware = (req, res, next) => {
        next();
    };
}
module.exports = rateLimiterMiddleware;
