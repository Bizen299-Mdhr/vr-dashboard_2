const {checkSchema} = require('express-validator');
const sequelize = require("sequelize");
const {Op} = sequelize;
const {checkMaxLength, required, alphaNumeric} = require('@lib');
const {apiUsers} = require("@models");

let userValidator = checkSchema({
    'first_name': {
        custom : {
            options: function(value){
                required("First name", value);
                checkMaxLength("First Name", value, 50);
                return true;
            }
        }
    },
    'last_name': {
        custom : {
            options: function(value){
                required("Last name", value);
                checkMaxLength("Last name", value, 50);
                return true;
            }
        }
    },
    'username': {
        custom: {
            options: (value, {req}) => {
                required("Username", value, req);
                let isEdit = req.params && req.params.id ? true : false;
                checkMaxLength("Username", value, 30, req);
                return new Promise((resolve, reject) => {
                    let whereCondition = {where: {
                        'username':sequelize.where(sequelize.fn('lower', sequelize.col('username')), sequelize.fn('lower',value))
                    }};
                    if (isEdit) {
                        whereCondition = {
                            where: {
                                'username':sequelize.where(sequelize.fn('lower', sequelize.col('username')), sequelize.fn('lower',value)),
                                _id: {
                                    [Op.ne]: req.params.id
                                }
                            }
                        };
                    }
                    apiUsers.findOne(whereCondition).then(admin => {
                        if (admin === null) {
                            resolve(true);
                        } else {
                            reject('Username already exists');
                        }
                    });
                });
            }
        }
    },
    'email': {
        custom: {
            options: (value, {req}) => {
                required("Email", value, req);

                let isEdit = req.params && req.params.id ? true : false;

                checkMaxLength("Email", value, 64, req);
                return new Promise((resolve, reject) => {
                    let whereCondition = {where:{
                        'email':sequelize.where(sequelize.fn('lower', sequelize.col('email')), sequelize.fn('lower',value))
                    }};
                    if (isEdit) {
                        whereCondition = {
                            where: {
                                'email':sequelize.where(sequelize.fn('lower', sequelize.col('email')), sequelize.fn('lower',value)),
                                _id: {
                                    [Op.ne]: req.params.id
                                }
                            }
                        };
                    }
                    apiUsers.findOne(whereCondition).then(admin => {
                        if (admin === null) {
                            resolve(true);
                        } else {
                            reject('Email already exists');
                        }
                    }).catch(() => {
                        resolve(true);
                    });
                });
            }
        },
        isEmail: {
            errorMessage: 'Not a valid email'
        }
    },
    'password': {
        custom: {
            options: (value, {req}) => {
                required("Password", value, req);
                alphaNumeric("Password", value,req);
                return true;
            }
        }
    }
});
module.exports = {userValidator};