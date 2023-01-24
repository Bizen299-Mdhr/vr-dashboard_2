const redis = require("redis");
const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    port: process.env.REDIS_PORT
});

const getRedisValue = (key) => {
    return new Promise(function (resolve, reject) {
        {
            redisClient.get(key, function (err, value) {
                if (err) {
                    reject(err);
                }
                resolve(value);
            });
        }
    });
};

const setRedisValue = (key, value) => {
    redisClient.set(key, value);
};

const deleteKey = (key) => {
    return new Promise((resolve, reject) => {
        redisClient.del(key, (err) => {
            if (err) {
                reject(err);
            }
            resolve(1);
        });
    });
};

const keyExist = (key) => {
    return new Promise(function (resolve) {
        redisClient.exists(key, function (err, reply) {
            if (reply === 1) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
};

module.exports = {
    getRedisValue,
    setRedisValue,
    deleteKey,
    redisClient,
    keyExist

};
