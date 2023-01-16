const BaseService = require('@baseService');
const { portfolioInformation } = require('@models');
const { uplaodFileToPath } = require("@lib");
const sequelize = require("sequelize");

class PortfolioService extends BaseService {
    constructor() {
        super(portfolioInformation);
        this.filterFields = [
            'image_title'
        ];

    }
    async createPageData() {
        return {
            data: await this.model.findOne({
                where: { tag: 'page_title_tag' }
            }),
            tags: await this.model.findAll({
                attributes: [[sequelize.fn('DISTINCT', sequelize.col('tag')), 'tag']],
                where: {
                    tag: { [sequelize.Op.not]: 'page_title_tag' }
                }
            })
        };
    }

    async editPageData(id) {
        return { 
            data: await this.findOrFail(id) ,
            tags: await this.model.findAll({
                attributes: [[sequelize.fn('DISTINCT', sequelize.col('tag')), 'tag']],
                where: {
                    tag: { [sequelize.Op.not]: 'page_title_tag' }
                }
            }),
            portfolioPageTitle: await this.model.findOne({
                where: { tag: 'page_title_tag' }
            })
        
        };
    }
    async create(req) {
        let imageName = '';
        if (req.files) {
            imageName = await uplaodFileToPath(req, 'public/backend', '/uploads/frontend/portfolio/');
        }
        let portfolioData = this.parseAdminData(req.body);
        this.upsert({page_title: req.body.page_title,page_sub_title: req.body.page_sub_title,tag:'page_title_tag'}, {where:{tag:'page_title_tag'}});
        portfolioData['image'] = imageName;
        await this.model.create(portfolioData);
    }

    async updatePortfolioInfo(req) {
        this.upsert({page_title: req.body.page_title,page_sub_title: req.body.page_sub_title,tag:'page_title_tag'}, {where:{tag:'page_title_tag'}});
  
        let portfolioData = this.parseAdminData(req.body);
        if (req.files) {
            let imageName = '';
            imageName = await uplaodFileToPath(req, 'public/backend', '/uploads/frontend/portfolio/');
            portfolioData['image'] = imageName;
        }
        return this.model.update(portfolioData, {where: {_id: req.params.id}});
    }

    parseAdminData(data) {
        const parsed = {
            ...data,
            'created_at': new Date(),
            'updated_at': new Date()
        };
        delete parsed.page_title;
        delete parsed.page_sub_title;
        return parsed;
    }

    async delete(id, trx = null) {
        await this.checkExists({ _id: id });
        return this.model.destroy({ where: { _id: id }, transaction: trx ,individualHooks: true});
    }
}

module.exports = PortfolioService;