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
        page_sub_title: {
            type: DataTypes.STRING
        }, 
        sub_sectionone_title: {
            type: DataTypes.STRING
        },
        section_one_detail: {
            type: DataTypes.JSONB
        },
        section_two_detail: {
            type: DataTypes.JSONB
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
        tableName: "contact_informations",
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    };

    const contactInformation = sequelize.define('contactInformation', modelDefinition, modelOptions);
    sequelizePaginate.paginate(contactInformation);
    return contactInformation;
};