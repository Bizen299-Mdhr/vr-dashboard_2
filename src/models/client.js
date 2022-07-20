"use strict";

const {generateRandomString} = require('../helpers/commonHelper');

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
        client_secret: {
            type: DataTypes.STRING
        },
        grants: {
            type: DataTypes.STRING
        },
        redirect_uris: {
            type: DataTypes.STRING
        },
        created_at: {type: DataTypes.DATE, defaultValue: sequelize.fn('now')},
        updated_at: {type: DataTypes.DATE, defaultValue: sequelize.fn('now')}
    };
    let modelOptions = {
        tableName: "clients",
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        hooks: {
            beforeCreate: hashClientNsecret,
            beforeUpdate: hashClientNsecret
        }
    };

    const clientModel = sequelize.define('clients', modelDefinition, modelOptions);
    return clientModel;
};

async function hashClientNsecret(Client) {
    Client.client_secret = generateRandomString(36);

}