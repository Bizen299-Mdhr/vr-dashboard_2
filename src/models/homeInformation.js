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
            allowNull: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        first_name: {
            type: DataTypes.STRING
        },
        middle_name: {
            type: DataTypes.STRING
        },
        last_name: {
            type: DataTypes.STRING
        },
        facebook_url: {
            type: DataTypes.STRING
        },
        twitter_url: {
            type: DataTypes.STRING
        },
        linkedin_url: {
            type: DataTypes.STRING
        },
        remarks: {
            type: DataTypes.TEXT
        },
        image: {
            type: DataTypes.STRING
        },
        created_at: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: sequelize.fn('now')
        },
        updated_at: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: sequelize.fn('now')

        }
    };
    let modelOptions = {
        tableName: "home_informations",
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    };

    const homeInformation = sequelize.define('homeInformation', modelDefinition, modelOptions);
    sequelizePaginate.paginate(homeInformation);
    return homeInformation;
};