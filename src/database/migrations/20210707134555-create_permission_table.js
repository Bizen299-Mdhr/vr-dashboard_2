'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.sequelize.query("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";", {returning: true}),
            queryInterface.createTable("permissions", {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER
                },
                _id: {
                    allowNull: true,
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.literal("uuid_generate_v4()")
                },
                name: {type: Sequelize.STRING, allowNull: false},
                slug: {type: Sequelize.STRING, allowNull: false},
                module: {type: Sequelize.STRING, allowNull: false},
                created_at: {type: Sequelize.DATE},
                updated_at: {type: Sequelize.DATE}
            })
        ]);
    },
    down: (queryInterface) => {
        return queryInterface.dropTable("permissions");
    }
};
