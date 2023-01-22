module.exports = Object.assign(
    {},
    require("./permissionMiddleware"),
    require("./configurationMiddleware"),
    require("./validate"),
    require('./rateLimiter')
);