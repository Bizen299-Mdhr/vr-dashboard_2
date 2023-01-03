const BaseService = require('@baseService');
const {aboutInformation} = require('@models');
const { uplaodFileToPath } = require("@lib");
class AboutService extends BaseService {
    constructor() {
        super(aboutInformation);
        this.filterFields = [
            'image'
        ];
    }
    async updateAboutPageInfo(req) {
        let profileImage ,subSectionThreeIcon,subSectionFourIcon= '';
        if (req.files) {
            console.log('req.files: ', req.files);
            profileImage = await uplaodFileToPath(req, 'public/backend', '/uploads/frontend/about-page/');
            subSectionThreeIcon = await uplaodFileToPath(req, 'public/backend', '/uploads/frontend/about-page/','sub_section_three_icon1');
            subSectionFourIcon = await uplaodFileToPath(req, 'public/backend', '/uploads/frontend/about-page/','sub_section_four_icon1');
        }
        let aboutInfo = this.parseAdminData(req.body);
        aboutInfo['image'] = profileImage;
        aboutInfo['sub_section_three_icon1'] = subSectionThreeIcon;
        aboutInfo['sub_section_four_icon1'] = subSectionFourIcon;
        await this.upsert(aboutInfo,{where: {'id':1}});
    }
    parseAdminData(data) {
        let obj = data;

        let result = {
            section_one_detail_row: [],
            section_two_detail_row: []
        };

        Object.keys(obj).forEach(function (key) {
            if (key.startsWith('section_one_detail_row')) {
                let parts = key.split('[');
                let index = parts[1].slice(0, -1);
                let subKey = parts[2].slice(0, -1);
                if (!result.section_one_detail_row[index]) {
                    result.section_one_detail_row[index] = {};
                }
                result.section_one_detail_row[index][subKey] = obj[key];
            }   
            
            if (key.startsWith('section_two_detail_row')) {
                let parts = key.split('[');
                let index = parts[1].slice(0, -1);
                let subKey = parts[2].slice(0, -1);
                if (!result.section_two_detail_row[index]) {
                    result.section_two_detail_row[index] = {};
                }
                result.section_two_detail_row[index][subKey] = obj[key];
            }
        });
        let filterSectionOneDetail = result.section_one_detail_row.filter(function (item) {
            return item !== undefined;
        });  
        let filterSectionTwoDetail = result.section_two_detail_row.filter(function (item) {
            return item !== undefined;
        });
     
        const parsed = {
            ...data,
            section_one_detail: filterSectionOneDetail,
            section_two_detail: filterSectionTwoDetail,
            'created_at': new Date(),
            'updated_at': new Date()

        };
        return parsed;
    }
}

module.exports = AboutService;