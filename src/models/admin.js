'use strict';
const sequelizePaginate = require('sequelize-paginate');
const bcrypt = require('bcryptjs');
// const configModel = require('../models/config');

module.exports = (sequelize, DataTypes) => {
    let modelDefinition = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        _id: {
            allowNull: false,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        role_id: {
            type: DataTypes.INTEGER,
            references: {model: "roles", key: "id"},
            allowNull: true
        },
        first_name: {type: DataTypes.STRING, defaultValue: ''},
        last_name: {type: DataTypes.STRING, defaultValue: ''},
        email: {type: DataTypes.STRING, unique: true, index: true},
        username: {type: DataTypes.STRING, index: true, comment:'ログインID'},
        password_method: {type: DataTypes.STRING, defaultValue: ''},
        password: {type: DataTypes.STRING},
        status: {type: DataTypes.STRING},
        selected_language: {type: DataTypes.STRING, defaultValue: 'ja'},
        contact_number: {type: DataTypes.STRING},
        mobile_num: {type: DataTypes.STRING, allowNull:true},
        fax: {type: DataTypes.STRING, allowNull:true},
        remarks: {type: DataTypes.TEXT, allowNull:true},
        image: {type: DataTypes.STRING, defaultValue: ''},
        last_accessed_ip: {type: DataTypes.STRING, defaultValue: ''},
        last_login: {type: DataTypes.DATE},
        token: {type: DataTypes.STRING, defaultValue: ''},
        token_expires: {type: DataTypes.DATE},
        otp_code: {
            type: DataTypes.STRING,
            allowNull: true
        },
        reset_password_token: {type: DataTypes.STRING},
        reset_password_expires: {type: DataTypes.DATE},
        password_resetted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        password_resetted_date:{
            type: DataTypes.DATE,
            allowNull: true
        },
        show_reset_password:{
            type: DataTypes.BOOLEAN,
            allowNull:true
        },
        display_name: {
            type: DataTypes.VIRTUAL,
            get() {
                const spaces = this.get('first_name') != null ? ' ':'';
                return `${this.get('first_name')??''}${spaces}${this.get('last_name')}`;
            }
        },
        created_at: {type: DataTypes.DATE, defaultValue: sequelize.fn('now')},
        updated_at: {type: DataTypes.DATE, defaultValue: sequelize.fn('now')}
    };
    let modelOptions = {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        hooks: {
            beforeUpdate: versionIncrement
        }
    };
    const adminModel = sequelize.define('admin', modelDefinition, modelOptions);
    // adminModel.sync();
    adminModel.validPassword = function (passwordToMatch, password) {
        return bcrypt.compareSync(passwordToMatch, password);
    };

    adminModel.associate = (models) => {
        adminModel.belongsTo(models.role, {foreignKey: 'role_id', 'as': 'role'});
        adminModel.hasMany(models.userRole, {foreignKey: 'user_id', 'as': 'userRoles'});
    };
    sequelizePaginate.paginate(adminModel);
    return adminModel;

};
function versionIncrement(data) {
    data.version += 1;
}