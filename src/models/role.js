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
        slug: {type: DataTypes.STRING, required: true},
        permission: {type: DataTypes.ARRAY(DataTypes.TEXT), allowNull: false},
        created_at: {type: DataTypes.DATE, defaultValue: sequelize.fn('now')},
        updated_at: {type: DataTypes.DATE, defaultValue: sequelize.fn('now')}
    };
    let modelOptions = {
        tableName: "roles",
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    };
    const roleModel =  sequelize.define('role', modelDefinition, modelOptions);
    sequelizePaginate.paginate(roleModel);
    roleModel.associate = (models) => {
        roleModel.hasMany(models.userRole, {foreignKey: 'role_id', 'as': 'roleUsers'});
    };
    // roleModel.sync();
    return roleModel;
};
