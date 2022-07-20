const log4js = require("log4js");
const logger = require("./logger").application;

module.exports = (options) => {
    options = options || {};  
    options.level = options.level || "auto";  
    return log4js.connectLogger(logger, options);  
};