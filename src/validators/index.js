module.exports = Object.assign(
    {},
    require('./roleValidator'),
    require('./adminValidator'),
    require('./EmailValidation'),
    require('./ipAccessValidator'),
    require('./otpValidator'),

    //api validators
    require('./api/tokenValidator'),
    require('./api/userValidator')
);