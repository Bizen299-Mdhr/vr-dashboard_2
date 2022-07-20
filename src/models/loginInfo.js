"use strict";
const sequelizePaginate = require('../model/pagination');

module.exports = (sequelize, DataTypes) => {
    let modelDefinition = {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'admins',
                key: 'id'
            }
        },
        login_ip_address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        login_date_time: {
            allowNull: true,
            type: DataTypes.DATE
        },
        logout_date_time: {
            allowNull: true,
            type: DataTypes.DATE
        }
    };
    let modelOptions = {
        tableName: "login_infos",
        timestamps: false
    };
    const loginInfo = sequelize.define('loginInfo', modelDefinition, modelOptions);
    loginInfo.associate = (models) => {
        loginInfo.belongsTo(models.admin, {foreignKey: 'user_id', 'as': 'admins'});
    };
    sequelizePaginate.paginate(loginInfo);
    return loginInfo;
};