const BaseService = require('@baseService');
const {loginInfo, admin} = require('@models');
const {Op} = require('sequelize');
const moment = require("moment");

class loginLogService extends BaseService {
    constructor() {
        super(loginInfo);
        this.filterFields = [
            'first_name', 'last_name'
        ];
    }

    async getData(req) {
        const payload = {
            ...this.dateRangeFilterQuery(req),
            order: [['id', 'DESC']],
            page: req.query.page ?? 1,
            include: [
                {
                    model: admin, 
                    ...this.buildFilterQuery(req),
                    attributes:['first_name', 'last_name'],
                    as: "admins"
                }
            ]

        };
        return this.getPaginatedData(payload);
    }

    async indexPageData(req){
        return {
            ...await this.getData(req),
            defaultRange:moment().startOf('day').format('YYYY/MM/DD')+' - '+moment().endOf('day').format('YYYY/MM/DD')
        };
    }

    buildFilterQuery(req){
        let filterQuery = null;
        const { query } = req;
        if (!query) {return filterQuery;}
        if(query){
            const keywordFilterArray = [];
            if (query.keyword) {
                const filterArray = this.filterFields;
                for (const field of filterArray) {
                    keywordFilterArray.push(
                        {
                            [field]: { [Op.iLike]: `%${query.keyword.trim()}%`}
                        }
                    );
                }
                filterQuery = {
                    [Op.or]:keywordFilterArray
                };
            }
        }
        if(filterQuery){
            return {where: filterQuery};
        }
        return filterQuery;
    }

    dateRangeFilterQuery(req){
        let filterQuery = {};
        const { query } = req;
        let from = moment().startOf('day');
        let to = moment().endOf('day');
        if(query){
            if(query.date_range){
                const range = query.date_range.split("-");
                from = moment(range[0].trim(), 'YYYY/MM/DD').startOf('day');
                to = moment(range[1].trim(), 'YYYY/MM/DD').endOf('day');
            }
        }
        filterQuery['login_date_time'] = {
            [Op.between] : [new Date(from), new Date(to)]
        };
        return {where: filterQuery};
    }
}

module.exports = loginLogService;