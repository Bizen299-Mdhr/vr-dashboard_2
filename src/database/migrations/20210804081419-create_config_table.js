"use strict";

module.exports = {
    up: async (queryInterface, DataTypes) => {
        return queryInterface.createTable(
            "configs",
            {
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
                name: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                value: { 
                    type: DataTypes.STRING, 
                    allowNull: true
                },
                type: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                attribute: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                help_text: {
                    type: DataTypes.TEXT,
                    allowNull: true
                },
                created_at: {
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.fn("now")
                },
                updated_at: {
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.fn("now")
                }
            }
        );
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    },

    down: async (queryInterface) => {
        return queryInterface.dropTable("configs");
    }
};
