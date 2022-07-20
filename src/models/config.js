"use strict";
const sequelizePaginate = require('sequelize-paginate');

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
        name: {
            type: DataTypes.STRING
        },
        value: {
            type: DataTypes.STRING
        },
        type: {
            type: DataTypes.STRING
        },
        attribute: {
            type: DataTypes.STRING
        }, 
        help_text: {
            type: DataTypes.TEXT
        },
        created_at: {type: DataTypes.DATE, defaultValue: sequelize.fn('now')},
        updated_at: {type: DataTypes.DATE, defaultValue: sequelize.fn('now')}
    };
    let modelOptions = {
        tableName: "configs",
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    };

    const config = sequelize.define('config', modelDefinition, modelOptions);
    sequelizePaginate.paginate(config);
    return config;
};