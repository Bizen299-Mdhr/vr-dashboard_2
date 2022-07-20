const Boom = require("@hapi/boom");
const BaseService = require('@apiBaseService');
const {apiUsers} = require('@models');
const PROTECTED_ATTRIBUTES = ['password'];
const sequelize = require('sequelize');
const { Op } = sequelize;
const {bcryptPassword} = require("@lib");
class ApiUserService extends BaseService {
    constructor() {
        super(apiUsers);
        this.filterFields = [
            'first_name', 'email'
        ];
    }

    getData(req) {
        const payload = {
            ...this.buildFilterQuery(req),
            page: req.query.page ?? 1
        };
        return this.getAPIPaginatedData(payload);
    }

    async indexPageData(req) {
        return {
            ...await this.getData(req)
        };
    }

    buildFilterQuery(req) {
        let filter = {};
        let keywordFilter = {};
        const { query } = req;
        if (!query) {
            return filter;
        }
        if (query) {
            if (query.keyword) {
                keywordFilter[Op.or] = this.buildKeywordQuery(query.keyword);
            }
            if (!query.include_inactive) {
                filter['status'] = { [Op.ne]: false };
            }
        }
        const finalMappedFilter = {
            ...keywordFilter,
            ...filter
        };
        return { where: finalMappedFilter };
    }

    async register(data) {
        const plainPassword = data['password'];
        data['password'] = bcryptPassword(plainPassword, 10);
        let user = await this.model.create(data);
        return user;
    }

    async findOne(query) {
        let user = await this.model.findOne({
            where: query.where,
            attributes: { exclude: PROTECTED_ATTRIBUTES }
        });
        if (!user) {
            throw Boom.notFound('User data not found.');
        }
        return user;
    }
}

module.exports = ApiUserService;