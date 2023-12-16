const moment = require('moment');
require("dotenv").config();

module.exports = {
    formatDate : (date, format) => {
        if(date== null || date==''){
            return null;
        }

        let dateFormat = format || "YYYY-MM-DD HH:mm:ss";
        let dateTime = moment(new Date(date),dateFormat).format(dateFormat);
        if(process.env.UTC_STATUS === "TRUE"){
            dateTime = moment(date,dateFormat).tz('Asia/Tokyo').format(dateFormat);
        }
        return dateTime;
    },
    formatDateString:(date, format) => {
        if(date && date!=''){
            let dateFormat = format || "YYYY/MM/DD";
            return  moment(date,dateFormat).format(dateFormat);
        }
        return null;
    }

};