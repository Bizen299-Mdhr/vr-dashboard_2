const BaseService = require('@baseService');
const {homeInformation} = require('@models');
const { uplaodFileToPath } = require("@lib");
class HomeService extends BaseService {
    constructor() {
        super(homeInformation);
        this.filterFields = [
            'first_name','middle_name','last_name'
        ];
    }
    async updateHomePageInfo(req) {
        let imageName = '';
        if (req.files) {
            imageName = await uplaodFileToPath(req, 'public/backend', '/uploads/frontend/home-page/','image','homebg.jpg');
        }
        let homeInfo = this.parseAdminData(req.body);
        homeInfo['image'] = imageName;
        await this.upsert(homeInfo,{where: {'id':1}});
    }
    parseAdminData(data) {
        const parsed = {
            ...data,
            'created_at': new Date(),
            'updated_at': new Date()

        };
        return parsed;
    }
}

module.exports = HomeService;