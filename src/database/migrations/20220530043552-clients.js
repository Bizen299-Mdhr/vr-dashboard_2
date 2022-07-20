'use strict';

module.exports = {
    up: (queryInterface, DataTypes) => {
        return queryInterface.createTable('clients', {
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
            name: {
                type: DataTypes.STRING,
                unique: true,
                ndex: true
            },
            client_secret: {
                type: DataTypes.STRING
            },
            grants: {
                type: DataTypes.STRING
            },
            redirect_uris: {
                type: DataTypes.STRING
            },
            created_at: {
                allowNull: false,
                type: DataTypes.DATE
            },
            updated_at: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: DataTypes.fn('now')
            }
        });
    },
    down: (queryInterface) => {
        return queryInterface.dropTable('clients');
    }
};
