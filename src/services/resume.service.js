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
        try{
           
            let resumeInfo = this.parseAdminData(req.body);
            this.truncate();
            return this.bulkCreate(resumeInfo);
            
        }catch(e){
            throw new Error(e);
        }
       
    }
    parseAdminData(data) {
        let workExpRows = data.work_experience_detail_row;
        let educationRows = data.education_detail_row;
        let combinedArray = workExpRows.concat(educationRows);
        combinedArray.map(val=>val.page_title = data.page_title);
        combinedArray.map(val=>val.end_date == ''? val.end_date=null:val.end_date);
        combinedArray.map(val=>val.start_date == ''? val.start_date=null:val.start_date);


        return combinedArray;
    }
}

module.exports = ResumeService;