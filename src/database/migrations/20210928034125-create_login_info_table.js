'use strict';
module.exports = {
    up: async (queryInterface, DataTypes) => {
        await queryInterface.createTable('login_infos', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            user_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'admins',
                    key: 'id'
                },
                comment:"ユーザーID"
            },
            login_ip_address: {
                type: DataTypes.STRING,
                allowNull: true,
                comment:"login_ip_address"
            },
            login_date_time: {
                allowNull: true,
                type: DataTypes.DATE, 
                comment:'login_date_time'
            },
            logout_date_time: {
                allowNull: true,
                type: DataTypes.DATE, 
                comment:'login_date_time'
            }
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable('login_infos');
    }
};