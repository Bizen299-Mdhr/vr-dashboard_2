'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('contact_informations', {
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
            page_title: {
                type: Sequelize.STRING
            },
            page_sub_title: {
                type: Sequelize.STRING
            }, 
            sub_sectionone_title: {
                type: Sequelize.STRING
            },
            section_one_detail: {
                type: Sequelize.JSONB
            },
            section_two_detail: {
                type: Sequelize.JSONB
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
        return queryInterface.dropTable('contact_informations');
    }
};
