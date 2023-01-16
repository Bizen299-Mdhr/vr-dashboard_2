"use strict";
const fs = require('fs');
const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
    let modelDefinition =  {
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
        }, page_sub_title: {
            type: DataTypes.STRING
        },
        image_title: {
            type: DataTypes.STRING
        },
        tag: {
            type: DataTypes.STRING
        },
        image: {
            type: DataTypes.STRING
        },
        position: {
            type: DataTypes.INTEGER
        },
        detail: {
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
        tableName: "portfolio_informations",
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        hooks: {
            beforeDestroy: deleteFile,
            beforeUpdate: deleteFile
        }
    };

    const resumeInformation = sequelize.define('portfolioInformation', modelDefinition, modelOptions);
    sequelizePaginate.paginate(resumeInformation);
    return resumeInformation;
};

function deleteFile(data) {
    if (data.image) {
        let rootDir = 'public/backend';
        if (fs.existsSync(rootDir + data.image)) {
            fs.unlinkSync(rootDir + data.image);
            fs.rmSync(rootDir + data.image, { recursive: true, force: true });
        }
    }
}