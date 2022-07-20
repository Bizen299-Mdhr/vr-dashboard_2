const {checkSchema} = require('express-validator');
const bcrypt = require('bcryptjs');

const {userModel} = require('../models');
const {genericError, required} = require('@lib');

let changePasswordValidation = checkSchema({
    'old_password': {
        custom: {
            options: async (value, {req}) => {
                required("Old Password", value);

                const userId = req.session.user._id;
                let user = await userModel.findOne({_id: userId});
                if(user){
                    let isMatch =  await bcrypt.compare(value, user.password);
                    if (isMatch) {
                        return true;
                    } else{
                        genericError('Old Password does not match with the system');
                    }
                }
            }
        }
    },
    'new_password': {
        custom: {
            options: async (value) => {
                required("New Password", value);
                return true;
            }
        }
    },
    'confirmPassword': {
        custom: {
            options: (value, {req}) => {
                required("Confirm Password", value);

                if (req.body.new_password === req.body.confirmPassword) {
                    return true;
                } else {
                    genericError('Confirm Password and New Password do not match');
                }
            }
        }
    }

});

module.exports.changePasswordValidation = changePasswordValidation;