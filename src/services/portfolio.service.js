const BaseService = require('@baseService');
const { portfolioInformation } = require('@models');
const { uplaodFileToPath, uplaodMultipleFileToPath } = require("@lib");
const sequelize = require("sequelize");
const db = require("@db").postgres;

class PortfolioService extends BaseService {
    constructor() {
        super(portfolioInformation);
        this.filterFields = [
            'image_title'
        ];
        this.limit = 99999;

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
            data: await this.findOrFail(id),
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

    async getWorkTags() {
        let data = await db.query("select distinct UPPER(tag) as tag  from portfolio_informations where tag not in('page_title_tag')");
        return data?.[0] ?? [];
    }

    async findAllPortFolio() {
        let data = await db.query("select *  from portfolio_informations where tag not in('page_title_tag') order by position asc");
        return data?.[0] ?? [];
    }

    async create(req) {
        this.upsert({ page_title: req.body.page_title, page_sub_title: req.body.page_sub_title, tag: 'page_title_tag' }, { where: { tag: 'page_title_tag' } });
        let images = typeof req.files === 'object' && Array.isArray(req.files) ? req.files : [req.files];
   
        if (images) {
            for (const file of images) {
                let fileImage = Array.isArray(file.image) ? file.image : [file.image];
                for (const f of fileImage) {
                    let imageName = '';
                    imageName = await uplaodMultipleFileToPath(f, 'public/backend', '/uploads/frontend/portfolio/');
                    let portfolioData = this.parseAdminData(req.body);
                    portfolioData['image'] = imageName;
                    await this.model.create(portfolioData);
                }
            }
        }
    }

    async updatePortfolioInfo(req) {
        this.upsert({ page_title: req.body.page_title, page_sub_title: req.body.page_sub_title, tag: 'page_title_tag' }, { where: { tag: 'page_title_tag' } });

        let portfolioData = this.parseAdminData(req.body);
        if (req.files) {
            let imageName = '';
            imageName = await uplaodFileToPath(req, 'public/backend', '/uploads/frontend/portfolio/');
            portfolioData['image'] = imageName;
        }
        return this.model.update(portfolioData, { where: { _id: req.params.id } });
    }

    async updatePos(data,id){
        return this.model.update(data, { where: { id: parseInt(id) } });
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
        return this.model.destroy({ where: { _id: id }, transaction: trx, individualHooks: true });
    }
}

module.exports = PortfolioService;