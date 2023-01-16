const BaseService = require('@baseService');
const {contactInformation} = require('@models');
class ContactInfoService extends BaseService {
    constructor() {
        super(contactInformation);
        this.filterFields = [
            'title'
        ];
       
    }
    async updateContactInfo(req) {
        let contactInfoInfo = this.parseAdminData(req.body);
        await this.upsert(contactInfoInfo,{where: {'id':1}});
       
    }
    parseAdminData(data) {
         
        const parsed = {
            ...data,
            section_one_detail: data.section_one_detail_row,
            section_two_detail: data.section_two_detail_row,
            'created_at': new Date(),
            'updated_at': new Date()

        };
        return parsed;
    }
}

module.exports = ContactInfoService;