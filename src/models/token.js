'use strict';
module.exports = (sequelize, DataTypes) => {
    const modelDefinition =  {
        accessToken: DataTypes.STRING,
        refreshToken: DataTypes.STRING,
        clientId: DataTypes.INTEGER,
        userId: DataTypes.INTEGER,
        expiresAt: DataTypes.BIGINT,
        is_revoked:{
            defaultValue: false,
            type: DataTypes.BOOLEAN
        }
    };
    let modelOptions = {
        tableName: "tokens",
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    };

    const Token = sequelize.define('Token', modelDefinition, modelOptions);
    return Token;
};
