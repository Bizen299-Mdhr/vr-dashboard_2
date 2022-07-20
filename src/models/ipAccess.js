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
        ip_address: {type: DataTypes.STRING, required: true},
        created_at: {type: DataTypes.DATE, defaultValue: sequelize.fn('now')},
        updated_at: {type: DataTypes.DATE, defaultValue: sequelize.fn('now')}
    };
    let modelOptions = {
        tableName: "ip_accesses",
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    };
    const ipAccess = sequelize.define('ipAccess', modelDefinition, modelOptions);
    sequelizePaginate.paginate(ipAccess);
    return ipAccess;

};
