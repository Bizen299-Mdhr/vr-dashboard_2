const BaseService = require('@baseService');
const {emailTemplate} = require('@models');

class EmailTemplateService extends BaseService {
    constructor() {
        super(emailTemplate);
        this.filterFields = [
            'name','slug'
        ];
    }
    async create(payload){
        return await this.model.create(payload);
    }

    async findAndUpdate(id, data){
        delete data.code;
        await this.checkExists({_id: id});
        return await this.model.update(data, {where: {_id: id}, individualHooks: true});
    }

    getData(req) {
        const payload = {
            ...this.buildFilterQuery(req),
            order: [['created_at', 'DESC']],
            page: req.query.page ?? 1
        };
        return this.getPaginatedData(payload);
    }

    getAll(req) {
        const payload = {
            ...this.buildFilterQuery(req),
            order: [['created_at', 'DESC']]
        };
        return this.findAll(payload);
    }
    async delete(id){
        return await this.model.destroy({where: {_id: id}});
    }

}

module.exports = EmailTemplateService;