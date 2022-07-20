const Boom = require("@hapi/boom");
const { viewsPath } = require("@lib");
const { existsSync } = require("fs");
const {cms, api} = require("../logger/index");
const { singleErrorFormat } = require('@errors');

require("dotenv").config();

const getRespectiveErrorView = (statusCode) =>
    existsSync(viewsPath(`error/${statusCode}.ejs`));

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, request, response, next) => {
    if (!Boom.isBoom(error)) {
        error = Boom.boomify(error);
    }

    const { statusCode, message } = error.output.payload;

    if (request.headers.accept === "application/json" || request.headers['content-type'] === "application/json" || request.xhr) {
        api.debug(error.stack);
        return response.status(statusCode).json(singleErrorFormat(error.output.payload));
    }

    cms.debug(error.stack);

    if (process.env.APP_DEBUG === "true" || process.env.APP_DEBUG === undefined) {
        return response.render("error/error-stacktrace", {
            statusCode: statusCode,
            errorMessage: message,
            stackTrace: error.stack,
            requestMethod: request.method,
            requestUrl: `${process.env.CMSURL}${request.originalUrl}`
        });
    }
    if (!getRespectiveErrorView(statusCode)) {
        return response.render("error/500", error.output.payload);
    }
    return response.render(`error/${statusCode}`, error.output.payload);};

module.exports = errorHandler;
