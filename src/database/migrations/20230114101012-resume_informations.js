'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('resume_informations', 
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
                title: {
                    type: Sequelize.STRING
                },
                start_date: {
                    type: Sequelize.DATE
                },
                end_date: {
                    type: Sequelize.DATE
                },
                position: {
                    type: Sequelize.INTEGER
                },
                detail: {
                    type: Sequelize.TEXT
                },
                type: {
                    type: Sequelize.ENUM,
                    values: ["education", "work-experience", "inactive"],
                    defaultValue: "inactive"
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
        return queryInterface.dropTable('resume_informations');
    }
};