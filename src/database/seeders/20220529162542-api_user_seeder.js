'use strict';
require("module-alias/register");
const {DEFAULTFRONTENDUSER} = require("@constant");
const {bcryptPassword} = require("@lib");
const {apiUsers} = require('@models');

module.exports = {
    async up () {
        let userData = {
            '_id': DEFAULTFRONTENDUSER,
            'first_name': "Super Admin",
            'last_name': "Ekbana",
            'email': process.env.ADMIN_DEFAULT_EMAIL || "superadmin@mailinator.com",
            'username': 'admin',
            'password': bcryptPassword("123admin@", 10),
            'status': true,
            'is_blocked': false,
            'contact_number': '9999999999',
            'mobile_num': '7777777777'
        };
        
        const user = await apiUsers.findOne({where:{
            _id:DEFAULTFRONTENDUSER
        }});

        if(user === null){
            await apiUsers.create(userData);
        }
    },

    async down () {
      
    }
};
