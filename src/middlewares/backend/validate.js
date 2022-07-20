const http = require("http-status-codes");
const { validationResult } = require("express-validator");
const { multipleErrorFormat } = require('@errors');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const mappedErrors = errors.mapped();
        if (req.headers.accept === "application/json" || req.headers['content-type'] === "application/json" || req.xhr) {
            return res.status(http.StatusCodes.UNPROCESSABLE_ENTITY)
                .json(multipleErrorFormat(mappedErrors));
        }
        req.flash('errors', mappedErrors);
        req.flash('inputData', req.body);
        return res.redirect("back");
    }
    return next();
};

module.exports = {validate};
