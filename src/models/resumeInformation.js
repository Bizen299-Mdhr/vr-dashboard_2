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
        page_title: {
            type: DataTypes.STRING
        },
        title: {
            type: DataTypes.STRING
        },
        start_date: {
            type: DataTypes.DATE
        },
        end_date: {
            type: DataTypes.DATE
        },
        position: {
            type: DataTypes.INTEGER
        },
        detail: {
            type: DataTypes.TEXT
        },
        type: {
            type: DataTypes.ENUM,
            values: ["education", "work-experience", "inactive"],
            defaultValue: "inactive"
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
        tableName: "resume_informations",
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    };

    const resumeInformation = sequelize.define('resumeInformation', modelDefinition, modelOptions);
    sequelizePaginate.paginate(resumeInformation);
    return resumeInformation;
};