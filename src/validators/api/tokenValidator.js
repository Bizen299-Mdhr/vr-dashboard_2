const {checkSchema} = require('express-validator');
const {required} = require('@lib');
const {clients} = require("@models");
let clientData;

let tokenValidator = checkSchema({
    'client_id': {
        custom : {
            options: async function(value){
                required("Client Id", value);
                if(isNaN(parseInt(value))){
                    throw new Error("Client Id must be only number.");
                }
                clientData = await clients.findOne({where:{
                    id: value
                }});
                if(clientData === null){
                    throw new Error("Invalid client id.");
                }
                
                return true;
            }
        }
    },
    'client_secret': {
        custom : {
            options: function(value){
                required("Client secret", value);
                if(clientData?.client_secret != value){
                    throw new Error("Invalid client secret.");
                }
                return true;
            }
        }
    },
    'grant_type': {
        custom : {
            options: function(value){
                required("Grant type", value);
                if(!['password', 'refresh_token'].includes(value)){
                    throw new Error("Invalid grant type.");
                }
                return true;
            }
        }
    },
    'username':{
        custom : {
            options: function(value, {req}){
                if(req?.body?.grant_type === 'password' && typeof value === 'undefined'){
                    throw new Error("Username is required.");
                }
                return true;
            }
        }
    },
    'password':{
        custom : {
            options: function(value, {req}){
                if(req?.body?.grant_type === 'password' && typeof value === 'undefined'){
                    throw new Error("Password is required.");
                }
                return true;
            }
        }
    },
    'refresh_token':{
        custom : {
            options: function(value, {req}){
                if(req?.body?.grant_type === 'refresh_token' && typeof value === 'undefined'){
                    throw new Error("Refresh token is required.");
                }
                return true;
            }
        }
    }
});

module.exports = {tokenValidator};