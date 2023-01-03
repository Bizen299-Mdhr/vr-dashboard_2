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
        title: {
            type: DataTypes.STRING
        },
        image: {
            type: DataTypes.STRING
        },
        image_title_info: {
            type: DataTypes.STRING
        },

        section_one_title: {
            type: DataTypes.STRING
        },
        section_one_detail: {
            type: DataTypes.JSONB
        },
        section_two_title: {
            type: DataTypes.STRING
        },
        section_two_detail: {
            type: DataTypes.JSONB
        },
        section_three_title: {
            type: DataTypes.STRING
        },  
        sub_section_three_icon1: {
            type: DataTypes.STRING
        },
        sub_section_three_title: {
            type: DataTypes.STRING
        },sub_section_three_detail: {
            type: DataTypes.TEXT
        }, 
        
        section_four_title: {
            type: DataTypes.STRING
        },  
        sub_section_four_icon1: {
            type: DataTypes.STRING
        },
        sub_section_four_title: {
            type: DataTypes.STRING
        },sub_section_four_detail: {
            type: DataTypes.TEXT
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
        tableName: "about_informations",
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    };

    const aboutInformation = sequelize.define('aboutInformation', modelDefinition, modelOptions);
    sequelizePaginate.paginate(aboutInformation);
    return aboutInformation;
};