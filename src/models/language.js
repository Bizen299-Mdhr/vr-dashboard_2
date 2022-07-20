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
        name: {type: DataTypes.STRING, required: true},
        language_code: {type: DataTypes.STRING, required: true},
        group: {type: DataTypes.ENUM('frontend', 'backend'), required: true},
        created_at: {type: DataTypes.DATE, defaultValue: sequelize.fn('now')},
        updated_at: {type: DataTypes.DATE, defaultValue: sequelize.fn('now')}
    };
    let modelOptions = {
        tableName: "languages",
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    };
    const emailTemplate = sequelize.define('language', modelDefinition, modelOptions);
    // emailTemplate.sync();
    sequelizePaginate.paginate(emailTemplate);
    return emailTemplate;

};
