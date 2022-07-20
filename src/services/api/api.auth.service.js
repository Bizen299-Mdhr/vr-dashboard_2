const {Token} = require('@models');
const sequelize = require('sequelize');
const {Op} = sequelize;

class ApiAuthService {

    async performLogout(data){
        if(data !== 'undefined'){
            const extractedToKen = data.split('Bearer ')?.[1];
            const tokenData = await Token.findOne({
                where:{
                    [Op.or]:{
                        accessToken:extractedToKen,
                        refreshToken:extractedToKen
                    }
                }
            });
            if(tokenData){
                Token.update({
                    is_revoked:true
                }, {where:{id:tokenData.id}});
            }
        }

    }
}

module.exports = ApiAuthService;