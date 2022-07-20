const { checkSchema } = require('express-validator');
const {required} = require('@lib');

let otpValidator = checkSchema({
    'otp_code': {
        custom: {
            options: async (value) => {
                required('Otp Code ', value);
                return true;
            }
        }
    }
});
module.exports = { otpValidator };