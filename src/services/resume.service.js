const BaseService = require('@baseService');
const {resumeInformation} = require('@models');
class ResumeService extends BaseService {
    constructor() {
        super(resumeInformation);
        this.filterFields = [
            'title'
        ];
       
    }
    async updateResumePageInfo(req) {
       
        let resumeInfo = this.parseAdminData(req.body);
        this.truncate();
        return this.bulkCreate(resumeInfo);
       
    }
    parseAdminData(data) {
        let workExpRows = data.work_experience_detail_row;
        let educationRows = data.education_detail_row;
        let combinedArray = workExpRows.concat(educationRows);
        combinedArray.map(val=>val.page_title = data.page_title);

        return combinedArray;
    }
}

module.exports = ResumeService;