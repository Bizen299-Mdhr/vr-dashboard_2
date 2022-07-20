const BaseService = require('@baseService');
const {ipAccess} = require('@models');

class IpAccesService extends BaseService {
    constructor() {
        super(ipAccess);
        this.filterFields = [
            'name'
        ];
    }

    async getData() {      
        let ipAccess = await this.model.findAll();
        return {docs:ipAccess};
    }

    async create(data) {
        let totalRecords = data.ip_values;
        totalRecords = [...new Set(totalRecords)];
        if(totalRecords.length > 0){
            await this.model.truncate();
            for(let i=0; i < totalRecords.length ; i++){
                await this.model.create({
                    ip_address:totalRecords[i]
                });
            }
        }
    }
}

module.exports = IpAccesService;