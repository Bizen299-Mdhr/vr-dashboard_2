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
            allowNull: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDv4
        },
        name: {type: DataTypes.STRING, required: true},
        slug: {type: DataTypes.STRING, required: true},
        module: {type: DataTypes.STRING, required: true},
        created_at: {type: DataTypes.DATE, defaultValue: sequelize.fn('now')},
        updated_at: {type: DataTypes.DATE, defaultValue: sequelize.fn('now')}

    };
    let modelOptions = {
        tableName: "permissions",
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    };

    const permossionModel = sequelize.define('permission', modelDefinition, modelOptions);
    // permossionModel.sync();
    return permossionModel;
};
