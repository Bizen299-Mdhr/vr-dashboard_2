'use strict';

module.exports = {
    up: async (queryInterface, DataTypes) => {
        return queryInterface.createTable('user_roles',
            {
                id: {allowNull: false,autoIncrement: true,primaryKey: true,type: DataTypes.INTEGER},
                _id: {allowNull: true,type: DataTypes.UUID,defaultValue: DataTypes.UUIDV4},
                user_id: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: 'admins',
                        key: 'id',
                        onDelete: 'SET NULL'
                    },
                    allowNull:true},
                role_id: {
                    type: DataTypes.INTEGER, 
                    references: {
                        model: 'roles',
                        onDelete: 'SET NULL',
                        key: 'id'
                    },
                    allowNull:true},
                role_slug: {type: DataTypes.STRING, allowNull:true},
                created_at: {type: DataTypes.DATE, defaultValue: DataTypes.fn('now')},
                updated_at: {type: DataTypes.DATE, defaultValue: DataTypes.fn('now')}
            }
        );
    },
    down: async (queryInterface) => {
        return queryInterface.dropTable('user_roles');
    }
};

