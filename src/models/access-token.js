"use strict";
module.exports = (sequelize, DataTypes) => {
    let modelDefinition = {
        id: {allowNull: false,autoIncrement: true,primaryKey: true,type: DataTypes.INTEGER},
        _id: {allowNull: true,type: DataTypes.UUID,defaultValue: DataTypes.UUIDV4},  
        login_id: {allowNull: false,type: DataTypes.INTEGER,comment:'ログインID', 
            references: {
                table: 'admins',
                key: 'id'
            }
        },
        token: {allowNull: false,type: DataTypes.STRING,comment:'トークン'},
        expire_datetime: {allowNull: true,type: DataTypes.DATE,comment:'有効期限'},
        created_date: {allowNull: false,type: DataTypes.DATE,defaultValue: sequelize.fn('now'),comment:'作成日時'},
        last_modified_date: {allowNull: false,type: DataTypes.DATE,defaultValue: sequelize.fn('now'),comment:'最終更新日時'}   
    };
    let modelOptions = {
        tableName: "access_token",
        createdAt: 'created_date',
        updatedAt: 'last_modified_date'
    };

    const accessToken = sequelize.define('accessToken', modelDefinition, modelOptions);
    return accessToken;
};