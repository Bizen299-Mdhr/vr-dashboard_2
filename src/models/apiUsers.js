'use strict';
const sequelizePaginate = require('sequelize-paginate');

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
        first_name: { type: DataTypes.STRING, defaultValue: '' },
        last_name: { type: DataTypes.STRING, defaultValue: '' },
        email: { type: DataTypes.STRING, unique: true, index: true },
        username: { type: DataTypes.STRING, index: true, unique: true },
        password: { type: DataTypes.STRING },
        status: { type: DataTypes.BOOLEAN, defaultValue: false },
        is_blocked: { type: DataTypes.BOOLEAN, defaultValue: false },
        contact_number: { type: DataTypes.STRING },
        mobile_num: { type: DataTypes.STRING, allowNull: true },
        address: { type: DataTypes.STRING, allowNull: true },
        code: { type: DataTypes.STRING, allowNull: true },
        code_expiry_at: { type: DataTypes.DATE },
        created_at: { type: DataTypes.DATE, defaultValue: sequelize.fn('now') },
        updated_at: { type: DataTypes.DATE, defaultValue: sequelize.fn('now') }
    };
    let modelOptions = {
        tableName: "api_users",
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    };
    const apiUsers = sequelize.define('apiUsers', modelDefinition, modelOptions);
    sequelizePaginate.paginate(apiUsers);
    return apiUsers;
};