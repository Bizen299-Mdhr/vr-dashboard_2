let constants = require("@constant");

exports.singleErrorFormat = (error) => {
    let mappedError = {}; 
    let meta = {
        copyright: constants.COPYRIGHT,
        emails: constants.COPYRIGHTEMAIL,
        api: {
            version: constants.VERSION
        }
    };

    let newError = {
        code: error.param || error.statusCode,
        title: error.msg || error.message,
        detail: error.msg || error.message
    };

    mappedError['meta'] = meta;
    mappedError['errors'] = newError;
    return mappedError;
};