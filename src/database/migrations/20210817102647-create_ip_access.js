'use strict';

module.exports = {
    up: (queryInterface, DataTypes) => {
        return queryInterface.createTable('ip_accesses',
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
                ip_address: {type: DataTypes.STRING},
                created_at: {type: DataTypes.DATE, defaultValue: DataTypes.fn('now')},
                updated_at: {type: DataTypes.DATE, defaultValue: DataTypes.fn('now')}
            }
        );
    },
    down: (queryInterface) => {
        return queryInterface.dropTable('ip_accesses');
    }
};
