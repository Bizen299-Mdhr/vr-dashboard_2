const BaseService = require('@baseService');
const {config} = require('@models');
const { Op } = require("sequelize");

class ConfigService extends BaseService {
    constructor() {
        super(config);
        this.filterFields = [
            'name'
        ];
    }

    getData(req) {
        const payload = {
            ...this.buildFilterQuery(req, {name:{[Op.ne]: "ip-access"}}),
            order: [['name', 'ASC']],
            page: req.query.page ?? 1
        };
        return this.getPaginatedData(payload);
    }

    async getOnlyNameAndValue(){
        return await config.findAll({attributes: ['name', 'value']});
    }

    async findAndUpdate(id, data) {
        return await this.model.update(data, {where: {id: id}, individualHooks: true});
    }

    async delete(id){
        return await this.model.destroy({where: {_id: id}});
    }

}

module.exports = ConfigService;