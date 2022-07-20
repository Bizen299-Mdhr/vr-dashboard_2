'use strict';

module.exports = {
    up: (queryInterface, DataTypes) => {
        return queryInterface.createTable('email_template',
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
                title: {type: DataTypes.STRING},
                code: {type: DataTypes.STRING},
                subject: {type: DataTypes.STRING},
                body: {type: DataTypes.TEXT},
                created_at: {type: DataTypes.DATE, defaultValue: DataTypes.fn('now')},
                updated_at: {type: DataTypes.DATE, defaultValue: DataTypes.fn('now')}
            }
        );
    },
    down: (queryInterface) => {
        return queryInterface.dropTable('email_template');
    }
};
