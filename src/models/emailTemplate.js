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
        title: {type: DataTypes.STRING, required: true},
        code: {type: DataTypes.STRING, required: true},
        subject: {type: DataTypes.STRING, required: true},
        body: {type: DataTypes.TEXT, required: true},
        created_at: {type: DataTypes.DATE, defaultValue: sequelize.fn('now')},
        updated_at: {type: DataTypes.DATE, defaultValue: sequelize.fn('now')}
    };
    let modelOptions = {
        tableName: "email_template",
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    };
    const emailTemplate =  sequelize.define('emailTemplate', modelDefinition, modelOptions);
    // emailTemplate.sync();
    sequelizePaginate.paginate(emailTemplate);
    return emailTemplate;

};
