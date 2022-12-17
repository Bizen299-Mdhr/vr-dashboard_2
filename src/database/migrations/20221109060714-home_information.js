'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('home_informations', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            _id: {
                allowNull: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            first_name: {
                type: Sequelize.STRING
            }, middle_name: {
                type: Sequelize.STRING
            }, last_name: {
                type: Sequelize.STRING
            }, facebook_url: {
                type: Sequelize.STRING
            }, twitter_url: {
                type: Sequelize.STRING
            }, linkedin_url: {
                type: Sequelize.STRING
            }, remarks: {
                type: Sequelize.TEXT
            }, image: {
                type: Sequelize.STRING
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('now')
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('now')

            }
        });
    },
    down: (queryInterface) => {
        return queryInterface.dropTable('home_informations');
    }
};
