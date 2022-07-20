// <APP ROOT>/lib/log/logger.js
const log4js = require("log4js");
const config = require("./log4js-config.js");
log4js.configure(config);

const console = log4js.getLogger();

const api         = log4js.getLogger("api");
const application = log4js.getLogger("application");
const sql          = log4js.getLogger("sql");
const cms          = log4js.getLogger("cms");

// ログ種別のエクスポート
module.exports = {
    console,
    api,
    application,
    sql,
    cms
};