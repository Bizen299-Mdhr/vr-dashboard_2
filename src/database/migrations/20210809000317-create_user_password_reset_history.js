'use strict';

module.exports = {
    up: async (queryInterface, DataTypes) => {
        return queryInterface.createTable('users_reset_password_histories', {
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
            user_id: {
                allowNull: true,
                type: DataTypes.STRING
            },
            password: {
                allowNull: true,
                type: DataTypes.STRING
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.fn("now")
            },
            updated_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.fn("now")
            }
        });
    },

    down: async (queryInterface) => {
        return queryInterface.dropTable('users_reset_password_histories');
    }
};
