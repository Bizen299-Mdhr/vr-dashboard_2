"use strict";

module.exports = (sequelize, DataTypes) => {
    let modelDefinition = {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        _id: {
            allowNull: false,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        user_id: {
            allowNull: true,
            type: DataTypes.STRING
        },
        password: {
            allowNull: true,
            type: DataTypes.STRING
        },
        created_at: {type: DataTypes.DATE, defaultValue: sequelize.fn('now')},
        updated_at: {type: DataTypes.DATE, defaultValue: sequelize.fn('now')}
    };
    let modelOptions = {
        tableName: "users_reset_password_histories",
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    };

    const resetPasswordHistory = sequelize.define('resetPasswordHistory', modelDefinition, modelOptions);
    return resetPasswordHistory;
};