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
        language: { type: DataTypes.STRING },
        word: { type: DataTypes.STRING },
        translation: { type : DataTypes.STRING },
        page_url: {type: DataTypes.STRING },
        group: {type: DataTypes.ENUM('frontend', 'backend'), defaultValue: 'backend', required: true}

    };
    let modelOptions = {
        tableName: "translations",
        timestamps: false
    };

    const LanguageModel =   sequelize.define('translation', modelDefinition,modelOptions);
    // LanguageModel.sync();
    sequelizePaginate.paginate(LanguageModel);

    return LanguageModel;

};