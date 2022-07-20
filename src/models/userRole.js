"use strict";
module.exports = (sequelize, DataTypes) => {
    let modelDefinition = {
        id: {allowNull: false,autoIncrement: true,primaryKey: true,type: DataTypes.INTEGER},
        _id: {allowNull: true,type: DataTypes.UUID,defaultValue: DataTypes.UUIDV4},
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'admins',
                key: 'id',
                onDelete: 'SET NULL'
            },
            allowNull:true},
        role_id: {
            type: DataTypes.INTEGER, 
            references: {
                model: 'roles',
                onDelete: 'SET NULL',
                key: 'id'
            },
            allowNull:true},
        role_slug: {type: DataTypes.STRING, allowNull:true},
        created_at: {type: DataTypes.DATE, defaultValue: sequelize.fn('now')},
        updated_at: {type: DataTypes.DATE, defaultValue: sequelize.fn('now')}
    };
    let modelOptions = {
        tableName: "user_roles",
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    };
    const userRole = sequelize.define('userRole', modelDefinition, modelOptions);
    userRole.associate = (models) => {
        userRole.belongsTo(models.admin, {foreignKey: 'user_id', 'as': 'adminRole'});
        userRole.belongsTo(models.role, {foreignKey: 'role_id', 'as': 'roleAdmin'});
    };
    return userRole;
};
