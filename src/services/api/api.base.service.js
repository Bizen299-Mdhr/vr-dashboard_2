const Boom = require("@hapi/boom");
const config = require('@config');
const sequelize = require("sequelize");
const { Op } = sequelize;

class ApiBaseService {
    constructor(model) {
        this.model = model;
        this.limit = config.pageLimit;
        this.config = config;
    }

    get filterFields() {
        return this._filterFields;
    }

    set filterFields(value) {
        this._filterFields = value;
    }

    async indexPageData(req) {
        return {
            ...await this.getData(req)
        };
    }

    getData(req) {
        let order = req.query.order ? req.query.order : 'id';
        let sort = req.query.sort ? req.query.sort : 'DESC';
        const payload = {
            ...this.buildFilterQuery(req),
            order: [[order, sort]],
            page: req.query.page ?? 1
        };
        return this.getAPIPaginatedData(payload);
    }

    async getAPIPaginatedData(query) {
        query.paginate = this.paginate !== undefined ? this.paginate : this.limit;
        const { docs, total } = await this.model.paginate(query);
        let response = {
            "perPage": query.paginate,
            "page": parseInt(query.page),
            "totalRows": total,
            "totalPage": total
        };
        let paginationResponse = {};
        paginationResponse.docs = docs;
        paginationResponse.pagination = response;
        return paginationResponse;
    }

    async findAll(query) {
        const docs = await this.model.findAll(query);
        return {
            docs,
            queryValue: query?.keyword ?? null
        };
    }

    async findOne(query) {
        let data = await this.model.findOne({
            where: query.where,
            attributes: query.attributes
        });
        if (data === null) {
            throw Boom.notFound("Data not found");
        }
        return data;
    }

    async find(query) {
        return await this.model.findOne({
            where: query.where
        });
    }

    async count(query) {
        let count = await this.model.count({ where: query.where });
        return count;
    }

    async create(data, trx = null) {
        return await this.model.create(data, { transaction: trx });
    }

    async bulkCreate(data, trx) {
        let result = await this.model.bulkCreate(data, { returning: true, transaction: trx });
        return result;
    }

    async findAndUpdate(id, data, trx = null) {
        await this.checkExists({ _id: id });
        const updatedData =  await this.model.update(data, { where: { _id: id }, individualHooks: true, transaction: trx });
        return updatedData?.[1]?.[0];
    }

    findOrFail(id, attributes = null) {
        return this.model.findOne({
            where: { _id: id },
            attributes: attributes
        }).then(function (record) {
            if (record) {
                return record;
            } else {
                throw Boom.notFound("Data not found");
            }
        });
    }

    async checkExists(query) {
        let count = await this.model.count({ where: query });
        if (count === 0) {
            throw Boom.notFound("Data not found");
        }
    }

    async delete(id, trx = null) {
        await this.checkExists({ _id: id });
        return this.model.destroy({ where: { _id: id }, transaction: trx });
    }

    buildFilterQuery(req, whereCondition = null) {
        const { query } = req;
        if (query.keyword) {
            return { where: { [Op.or]: this.buildKeywordQuery(query.keyword) } };

        }
        return { where: whereCondition };
    }

    buildKeywordQuery(keyword) {
        const queryArray = [];
        const filterArray = this.filterFields;
        for (const field of filterArray) {
            queryArray.push(
                {
                    [field]: { [Op.iLike]: `%${keyword.trim()}%` }
                }
            );
        }
        return queryArray;
    }
}

module.exports = ApiBaseService;