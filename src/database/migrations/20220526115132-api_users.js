'use strict';

module.exports = {
    async up(queryInterface, DataTypes) {
        return queryInterface.createTable(
            "api_users",
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
                first_name: { type: DataTypes.STRING, defaultValue: '' },
                last_name: { type: DataTypes.STRING, defaultValue: '' },
                email: { type: DataTypes.STRING, unique: true, index: true },
                username: { type: DataTypes.STRING, index: true, unique: true },
                password: { type: DataTypes.STRING },
                status: { type: DataTypes.BOOLEAN, defaultValue: false },
                is_blocked: { type: DataTypes.BOOLEAN, defaultValue: false },
                contact_number: { type: DataTypes.STRING },
                mobile_num: { type: DataTypes.STRING, allowNull: true },
                address: { type: DataTypes.STRING, allowNull: true },
                code: { type: DataTypes.STRING, allowNull: true },
                code_expiry_at: {
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.fn("now")
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
    },

    async down(queryInterface) {
        return queryInterface.dropTable("api_users");

    }
};
