const BaseService = require('@baseService');
const { blogInformation } = require('@models');
const { uplaodFileToPath } = require("@lib");

class BlogService extends BaseService {
    constructor() {
        super(blogInformation);
        this.filterFields = [
            'image','title'
        ];

    }
    async createPageData() {
        return {
            blogPageTitle: await this.model.findOne({
                where: { type: 'page_title' }
            })
        };
    }

    async editPageData(id) {
        return {
            data: await this.findOrFail(id),
            blogPageTitle: await this.model.findOne({
                where: { type: 'page_title' }
            })
        };
    }
    async create(req) {
        this.upsert({ page_title: req.body.page_title, page_sub_title: req.body.page_sub_title, type: 'page_title' }, { where: { type: 'page_title' } });
        let imageName = '';
        if (req.files) {
            imageName = await uplaodFileToPath(req, 'public/backend', '/uploads/frontend/blog/');
        }
        let blogData = this.parseAdminData(req.body);
        blogData['image'] = imageName;
        await this.model.create(blogData);
    }

    async updateblogInfo(req) {
        this.upsert({ page_title: req.body.page_title, page_sub_title: req.body.page_sub_title, type: 'page_title' }, { where: { type: 'page_title' } });
        let blogData = this.parseAdminData(req.body);
        if (req.files) {
            let imageName = '';
            imageName = await uplaodFileToPath(req, 'public/backend', '/uploads/frontend/blog/');
            blogData['image'] = imageName;
        }
        return this.model.update(blogData, { where: { _id: req.params.id } });
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

module.exports = BlogService;