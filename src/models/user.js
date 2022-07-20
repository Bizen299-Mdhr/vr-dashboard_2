'use strict';

const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    let modelDefinition = {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        first_name: {type: DataTypes.STRING},
        last_name: {type: DataTypes.STRING},
        email: {type: DataTypes.STRING, unique: true, index: true},
        username: {type: DataTypes.STRING, unique: true, index: true},
        password_method: {type: DataTypes.STRING, defaultValue: ''},
        password: {type: DataTypes.STRING},
        status: {type: DataTypes.STRING},
        contact_number: {type: DataTypes.STRING},
        image: {type: DataTypes.STRING, defaultValue: ''},
        last_accessed_ip: {type: DataTypes.STRING, defaultValue: ''},
        last_login: {type: DataTypes.DATE},
        token: {type: DataTypes.STRING, defaultValue: ''},
        token_expires: {type: DataTypes.DATE},
        reset_password_token: {type: DataTypes.STRING},
        reset_password_expires: {type: DataTypes.DATE},
        created_at: { type: DataTypes.DATE, defaultValue:sequelize.fn('now') },
        updated_at: { type: DataTypes.DATE, defaultValue:sequelize.fn('now') }
    };
    let modelOptions = {
        hooks: {
            // afterFind: imageUrl,
            beforeUpdate: hashPassword,
            beforeCreate: createHashPassword
        }
    };

    async function hashPassword(user) {
        if (user.changed('password')) {
            user.password = generateHash(user.password);
        }
    }
    async function createHashPassword(user) {
        user.password = generateHash(user.password);
    }

    let generateHash = (password) => {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
    };

    return  sequelize.define('user', modelDefinition,modelOptions);
};