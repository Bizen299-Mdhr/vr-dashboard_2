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
        station_name: {type: DataTypes.STRING, allowNull:true},
        station_prefecture: {type: DataTypes.STRING, allowNull:true},
        latitude: {type: DataTypes.STRING, allowNull:true},
        longitude: {type: DataTypes.STRING, allowNull:true},
        status_flag: {type: DataTypes.BOOLEAN, allowNull:true},
        version: {type: DataTypes.INTEGER, allowNull:false, defaultValue: 1},
        created_by_id: {type: DataTypes.INTEGER, allowNull:true},
        created_date: {type: DataTypes.DATE, defaultValue: sequelize.fn('now')},
        last_modified_by:{type: DataTypes.INTEGER, allowNull:true},
        last_modified_date: {type: DataTypes.DATE, defaultValue: sequelize.fn('now')},
        is_deleted:{type: DataTypes.DATE, allowNull:true}
    };
    let modelOptions = {
        hooks: {
            beforeUpdate: versionIncrement
        },
        tableName: "stations",
        createdAt: 'created_date',
        updatedAt: 'last_modified_date',
        paranoid: true,
        deletedAt: 'is_deleted'
    };
    const station = sequelize.define('station', modelDefinition, modelOptions);
    sequelizePaginate.paginate(station);
    return station;
};
function versionIncrement(data) {
    data.version += 1;
}
