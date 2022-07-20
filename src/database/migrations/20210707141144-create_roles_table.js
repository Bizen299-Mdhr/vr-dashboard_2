'use strict';

module.exports = {
    up: (queryInterface, DataTypes) => {
        return queryInterface.createTable("roles", {
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
            created_at: {type: DataTypes.DATE},
            updated_at: {type: DataTypes.DATE}

        });
    },
    down: (queryInterface) => {
        return queryInterface.dropTable("roles");
    }
};
