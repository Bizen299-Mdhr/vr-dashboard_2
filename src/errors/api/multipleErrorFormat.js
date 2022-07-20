let constants = require("@constant");

exports.multipleErrorFormat = (errors) => {
    let mappedError = {}; 
    let meta = {
        copyright: constants.COPYRIGHT,
        emails: constants.COPYRIGHTEMAIL,
        api: {
            version: constants.VERSION
        }
    };
    mappedError.meta = meta;
    mappedError.errors = errors;
    return mappedError;
};

