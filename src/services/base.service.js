const config = require('@config');
const sequelize = require("sequelize");
const { Op } = sequelize;

class BaseService {
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
        return this.getPaginatedData(payload);
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

    async getPaginatedData(query = {}) {
        query.paginate = this.paginate !== undefined ? this.paginate : this.limit;
        const { docs, pages, total } = await this.model.paginate(query);
        let from = ((query.page - 1) * query.paginate) + 1;
        let to = from + (docs.length - 1);
        return {
            docs,
            total,
            pageNum: query.page,
            pageLimit: query.paginate,
            pageCount: pages,
            queryValue: query.keyword ?? null,
            currentPage: query.page,
            from,
            to
        };
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
            throw new Error("Data not found");
        }
        return data;
    }

    async find(query) {
        try {
            return await this.model.findOne({
                where: query.where
            });
        } catch (error) {
            console.log(error);
        }

    }

    async count(query) {
        let count = await this.model.count({ where: query.where });
        return count;
    }

    async createPageData() {
        return {};
    }

    customBreadCrumb(customs) {
        return [].concat(customs);
    }
    /* eslint-disable no-unused-vars */
    async create(data, sessionUser = null, trx = null) {
        return await this.model.create(data, { transaction: trx });
    }
    
    async truncate() {
        return this.model.destroy({
            truncate: true,
            restartIdentity: true
        });
    }

    async bulkCreate(data, trx) {
        let result = await this.model.bulkCreate(data, { returning: true, transaction: trx });
        return result;
    }

    async editPageData(id) {
        return { data: await this.findOrFail(id) };
    }

    async findAndUpdate(id, data, trx = null) {
        // console.log(    await this.checkExists({ _id: id }));
        // await this.checkExists({ _id: id });
        return await this.model.update(data, { where: { _id: id }, individualHooks: true, transaction: trx });
    }

    findOrFail(id, attributes = null) {
        return this.model.findOne({
            where: { _id: id },
            attributes: attributes
        }).then(function (record) {
            if (record) {
                return record;
            } else {
                throw new Error("Data not found");
            }
        });
    }

    async checkExists(query) {
        let count = await this.model.count({ where: query });
        if (count === 0) {
            throw new Error("Data not found");
        }
    }

    async delete(id, trx = null) {
        await this.checkExists({ _id: id });
        return this.model.destroy({ where: { _id: id }, transaction: trx });
    }

    async destroy(id) {
        await this.checkExists({ id: id });
        return this.model.destroy({ where: { id: id } });
    }

    async findOneAndUpdate(query, updateData, trx = null) {
        let result = await this.model.update(updateData, {
            where: query.where,
            individualHooks: true,
            transaction: trx
        });
        return result;
    }

    async upsert(values, query) {
        let count = await this.model.count(query);
        if (count === 0) {
            return this.model.create(values);
        }
        return this.model
            .findOne(query)
            .then(function (obj) {
                // update
                if (obj) {
                    return obj.update(values);
                }
                // insert
                return this.model.create(values);
            });
    }

    buildFilterQuery(req, whereCondition = null) {
        const { query } = req;
        if (query.keyword) {
            return { where: { [Op.or]: this.buildKeywordQuery(query.keyword) } };

        }
        return { where: whereCondition };
    }

    buildMasterFilterQuery(query, column = 'status_flag', inactiveValue = false) {
        const whereCondition = {};
        if (!query.include_inactive) {
            whereCondition[column] = { [Op.ne]: inactiveValue };
        }
        if (query.keyword) {
            whereCondition[Op.or] = this.buildKeywordQuery(query.keyword);
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

    async customPagination(query, page, limit = this.limit) {
        this.model.findAll(
            this.paginateModel(query,
                { page, limit }
            )
        );
    }

    paginateModel = (query, { page, pageSize }) => {
        const offset = page * pageSize;
        const limit = pageSize;

        return {
            ...query,
            offset,
            limit
        };
    };

    masterDataOrderAndSort(column, sort) {
        column = column ? column : "created_date";
        sort = sort ? sort : "DESC";

        if (column === "department_name") {
            return [['department', column, sort]];
        }

        let orderArray = [[column, sort]];

        if (!['id', 'status', 'status_flag', 'order',
            'created_at', 'created_date', 'tax_display_order'].includes(column)) {
            orderArray = [[
                sequelize.fn(
                    'convert_to', sequelize.fn('lower',
                        sequelize.literal(`${column} COLLATE "C"`)
                    ),
                    'UTF8'), sort]
            ];
        }
        return orderArray;
    }
}

module.exports = BaseService;