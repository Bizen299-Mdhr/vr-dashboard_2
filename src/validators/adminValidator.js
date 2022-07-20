const {checkSchema} = require('express-validator');

const {admin} = require('../models');
const {MAINSUPERADMIN} = require("@constant");
const sequelize = require("sequelize");
const {Op} = sequelize;
const {getConfigData} = require("@lib");
const {checkMaxLength, required, genericError, between, alphaNumeric, onlyNumIncludeDash} = require('@lib');


let addAdminValidation = checkSchema({
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

    'image': {
        custom: {
            options: function (value, {req}) {
                return new Promise((resolve, reject) => {
                    if (req.files == null) {
                        resolve(true);
                    } else {
                        if(req.files.image.size > 15728640){
                            reject('Image size must not exceed 15 mb.');
                        }else if (req.files.image.mimetype === "image/jpeg" || req.files.image.mimetype === "image/png" || req.files.image.mimetype === "image/jpg") {
                            resolve(true);
                        } 
                        else {
                            reject('Please upload valid image files');
                        }
                    }
                });
            }
        }
    },
    'username': {
        custom: {
            options: (value, {req}) => {
                required("Username", value);

                let isEdit = req.params && req.params.id ? true : false;

                checkMaxLength("Username", value, 30);
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
                    admin.findOne(whereCondition).then(admin => {
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
        isEmail: {
            errorMessage: 'Not a valid email'
        },
        custom: {
            options: (value, {req}) => {
                required("Email", value);

                let isEdit = req.params && req.params.id ? true : false;

                checkMaxLength("Email", value, 64);
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
                    admin.findOne(whereCondition).then(admin => {
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
        }
    },
    'password': {
        custom: {
            options: (value, {req}) => {
                if (req.query._method == 'PUT' || req.body.password_method == "is_activation_link") {
                    return true;
                }
                required("Password", value);
                alphaNumeric("Password", value);
                between("Password", value, getConfigData(req,"Minimum Password Length"), 20);
                return true;
            }
        }
    },
    'role_id': {
        custom : {
            options: function(value, {req}){
                if(req.params.id !== MAINSUPERADMIN){
                    required("Admin role", value);
                }
                return true;
            }
        }
    },
    'status': {
        custom : {
            options: function(value){
                required("Status", value);
                return true;
            }
        }
    },
    'contact_number': {
        custom:{
            options: (value) => {
                required("Telephone no", value);
                between("Telephone no", value, 8, 13);
                return true;
            }
        }
    },
    'mobile_num': {
        custom:{
            options: (value) => {
                between("Telephone no", value, 8, 13);
                return true;
            }
        }
    },
    
    'fax': {
        custom:{
            options: (value) => {
                onlyNumIncludeDash("Fax", value);
                between("Fax", value, 8, 13);
                return true;
            }
        }
    },
    'remarks': {
        custom:{
            options: (value) => {
                return checkMaxLength("Remarks", value, 500);
            }
        }
    }
});

let changePasswordValidation = checkSchema({
    'password': {
        custom: {
            options: (value, {req}) => {
                required("Password", value);
                alphaNumeric("Password", value);
                between("Password", value, getConfigData(req,"Minimum Password Length"), 20);
                return true;
            }
        }
    },
    'confirm_password': {
        custom: {
            options: (value, {req}) => {
                required("Password", value);
                if (value !== req.body.password) {
                    genericError('Password do not match');
                } 
                return true;
            }
        }
    },
    'show_reset_password':{
        custom: {
            options: (value,{req}) => {
                if (!req.body.password) {
                    genericError('Please input the password.');
                } 
                return true;
            }
        }
    }
});

let forgotAdminPasswordValidation = checkSchema({
    'email': {
        isEmail: {
            errorMessage: 'Not a valid email'
        },
        custom: {
            options: (value) => {
                required("Email", value);
                return true;
            }
        }
    }
});

let resetAdminPasswordValidation = checkSchema({
    'password': {
        custom: {
            options: (value, {req}) => {
                const attrName= "Password";
                required(attrName, value);
                between(attrName, value, getConfigData(req,"Minimum Password Length"), 20);
                return true;
            }
        }
    },
    'confirm_password': {
        custom: {
            options: (value, {req}) => {
                required("Confirm password", value);
                if (value === req.body.password) {
                    return true;
                } else {
                    genericError('Password do not match');
                    throw new Error();
                }
            }
        }
    }
});

module.exports = {
    addAdminValidation,
    changePasswordValidation,
    forgotAdminPasswordValidation,
    resetAdminPasswordValidation
};