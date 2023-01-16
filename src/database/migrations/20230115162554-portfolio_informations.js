
'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('portfolio_informations', 
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
                image_title: {
                    type: Sequelize.STRING
                },
                tag: {
                    type: Sequelize.STRING
                },
                image: {
                    type: Sequelize.STRING
                },
                position: {
                    type: Sequelize.INTEGER
                },
                detail: {
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
            }
        );
    },
    down: (queryInterface) => {
        return queryInterface.dropTable('portfolio_informations');
    }
};