'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('about_informations', {
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
            title: {
                type: Sequelize.STRING
            },
            image: {
                type: Sequelize.STRING
            },
            image_title_info: {
                type: Sequelize.STRING
            },

            section_one_title: {
                type: Sequelize.STRING
            },
            section_one_detail: {
                type: Sequelize.JSONB
            },
            section_two_title: {
                type: Sequelize.STRING
            },
            section_two_detail: {
                type: Sequelize.JSONB
            },
            section_three_title: {
                type: Sequelize.STRING
            },  
            sub_section_three_icon1: {
                type: Sequelize.STRING
            },
            sub_section_three_title: {
                type: Sequelize.STRING
            },sub_section_three_detail: {
                type: Sequelize.TEXT
            }, 
            
            section_four_title: {
                type: Sequelize.STRING
            },  
            sub_section_four_icon1: {
                type: Sequelize.STRING
            },
            sub_section_four_title: {
                type: Sequelize.STRING
            },sub_section_four_detail: {
                type: Sequelize.TEXT
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
        return queryInterface.dropTable('about_informations');
    }
};
