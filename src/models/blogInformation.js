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
        }, 
        page_sub_title: {
            type: DataTypes.STRING
        },
        title: {
            type: DataTypes.STRING
        },
        image: {
            type: DataTypes.STRING
        }, 
        type: {
            type: DataTypes.STRING
        },
        detail: {
            type: DataTypes.TEXT('long')
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
        tableName: "blog_informations",
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        hooks: {
            beforeDestroy: deleteFile
        }
    };

    const resumeInformation = sequelize.define('blogInformation', modelDefinition, modelOptions);
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