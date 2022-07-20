const { checkSchema } = require('express-validator');
const _ = require("lodash");
const {genericError} = require('@lib');

let ipAccessValidator = checkSchema({
    'ip_values.*': {
        custom: {
            options: function (value) {
                let message = "Invalid IP address format.";

                if(_.countBy(value)['/'] === undefined || _.countBy(value)['/'] > 1){
                    throw new Error(message);
                }
                const splitted = value.split("/");

                if(!(/^(?:(?:^|\.)(?:2(?:5[0-5]|[0-4]\d)|1?\d?\d)){4}$/.test(splitted[0]))){
                    throw new Error(message);
                }
                if(isNaN(splitted[1])){
                    throw new Error(message);
                }
                if(1 > splitted[1] || splitted[1] > 32){
                    genericError(`The IP range must be between 1 to 32.`);
                }
                return true;
            }
        }
    }
});
module.exports = { ipAccessValidator };
