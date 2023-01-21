
'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('blog_informations',
            {
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
                title: {
                    type: Sequelize.STRING
                },  
                type: {
                    type: Sequelize.STRING
                }, 
                created_by: {
                    type: Sequelize.STRING
                },
                image: {
                    type: Sequelize.STRING
                },
                detail: {
                    type: Sequelize.TEXT('long')
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
            }

        );
    },
    down: (queryInterface) => {
        return queryInterface.dropTable('blog_informations');
    }
};
