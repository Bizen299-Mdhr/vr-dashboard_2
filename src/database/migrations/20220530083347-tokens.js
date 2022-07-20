'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('tokens', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            accessToken: {
                type: Sequelize.STRING
            },
            refreshToken: {
                type: Sequelize.STRING
            },
            clientId: {
                type: Sequelize.INTEGER,
                onDelete: 'cascade',
                references: {
                    model: {
                        tableName: 'clients'
                    },
                    key: 'id'
                }
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            expiresAt: {
                type: Sequelize.BIGINT
            },
            is_revoked:{
                defaultValue: false,
                type: Sequelize.BOOLEAN
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE
            }
        }).then(() => {
            queryInterface.addIndex('tokens', ['userId']);
        });
    },
    down: (queryInterface) => {
        return queryInterface.dropTable('tokens');
    }
};
