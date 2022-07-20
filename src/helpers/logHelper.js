const _ = require('lodash');
const moment = require('moment');
const fs = require('fs');

const { formatDate } = require('./dateHelper');
const { mkDirByPathSync, removeFile } = require('./fileHelper');
const { getClientIpAddress } = require('./commonHelper');

async function logApiRequest(requestData, resp, time, errorData) {
    let logData = {};
    const {headers, httpVersion, socket, originalUrl, originalMethod, baseUrl} = requestData;
    const {remoteAddress, remoteFamily} = socket;
    if (baseUrl === "/api/v1" || originalUrl.substring(0, 7) === '/api/v1' || originalUrl.match(/(^|\W)api($|\W)/)) {
        let ip = (requestData.headers['x-forwarded-for'] || '').split(',').pop() ||
            requestData.connection.remoteAddress ||
            requestData.socket.remoteAddress ||
            requestData.connection.socket.remoteAddress;
        if (errorData) {resp.statusCode = errorData.statusCode;}
        let message = resp.statusCode === 401 ? "Unauthorized" :
            resp.statusCode === 403 ? "Forbidden" :
                resp.statusCode === 200 ? "Ok" :
                    resp.statusCode === 201 ? "Created" :
                        resp.statusCode === 204 ? "No content" :
                            resp.statusCode === 400 ? "Bad Request" :
                                resp.statusCode === 404 ? "Not Found" :
                                    resp.statusCode === 500 ? "Internal Server Error" : "Ok";

        let metaInfoData = headers['meta-info'] ? !_.isEmpty(headers['meta-info']) ? JSON.parse(headers['meta-info']) : null : null;
        let currentDate = formatDate(new Date(), "yyyy-mm-dd HH:mm:ss");
        let headerData = requestData.headers;

        let regex = /^\/api\/v1.1.*/;
        logData['api_version'] = regex.test(originalUrl) ? 'v1.1' : 'v1';
        logData.date = currentDate;
        logData.userId = requestData?.user?._id ??'';
        logData.url = originalUrl;
        logData.level = baseUrl;
        logData.httpVersion = httpVersion;
        logData.remoteAddress = remoteAddress;
        logData.ip = ip;
        logData.remoteFamily = remoteFamily;
        logData.method = originalMethod;
        logData.time = time;
        logData.statusCode = resp.statusCode;
        logData['host_address'] = headers['host'] ? headers['host'] : '';
        logData.useragent = headers['user-agent'] ? headers['user-agent'] : '';
        logData.requestBody = resp.statusCode != 200 ? JSON.stringify(requestData.body) :'';
        logData.headersData = headerData ? JSON.stringify(headerData) : {};
        logData.deviceVersionName = metaInfoData?.ab ?? '';
        logData.deviceModel = metaInfoData ? metaInfoData.dm ? metaInfoData.dm : '' : '';
        logData.deviceOs = metaInfoData ? metaInfoData.os ? metaInfoData.os : '' : '';
        logData.deviceLatLong = metaInfoData ? metaInfoData.lc ? metaInfoData.lc : '' : '';
        logData.deviceId = metaInfoData ? metaInfoData.ud ? metaInfoData.ud : '' : '';
        logData.message = message ? message ? message : '' : '';
        logData.error = errorData ? errorData.stack ? errorData.stack : '' : '';
        logData.errorMessage = errorData ? errorData.message ? errorData.message : '' : '';
        logData.errorParam = errorData ? errorData.param ? errorData.param : '' : '';

        let logFolder = 'public/logs/api';
        mkDirByPathSync(logFolder);

        let filename = logFolder+ "/" + moment().format('YYYY-MM-DD') + '.log';
        let log = typeof logData == "string" ? logData : JSON.stringify(logData);
        if (fs.existsSync(filename)) {
            fs.appendFile(filename, "\n" + log, function (err) {
                if (err) {throw err;}
            });
        } else {
            fs.appendFile(filename, log, function (err) {
                if (err) {throw err;}
            });
        }
    }
}

async function logCrmEvents(req, type, status, data) {
    let logData = {};
    let currentDate = formatDate(new Date(), "yyyy-mm-dd HH:mm:ss");
    logData.date = currentDate;
    logData.userId = req.session && req.session.user && req.session.user._id ? req.session.user._id : '';
    logData.url = req.headers['host']+req.originalUrl;
    logData.ip = getClientIpAddress(req);
    logData.useragent = req.headers['user-agent'] ? req.headers['user-agent'] : '';
    logData.status = status;
    logData.type = type;
    logData.level = req.baseUrl;
    logData.httpVersion = req.httpVersion;
    logData.remoteAddress = req.socket.remoteAddress;
    logData.remoteFamily = req.socket.remoteFamily;
    logData.method = req.originalMethod;
    logData.time = '';
    logData.statusCode = status=="success"?'200':'500';
    logData['host_address'] = req.headers['host'] ? req.headers['host'] : '';
    logData.deviceVersionName = '';
    logData.deviceModel = '';
    logData.deviceOs = '';
    logData.deviceLatLong = '';
    logData.deviceId = '';
    logData.errorMessage = '';
    logData.errorParam = '';
    logData.message = data && data.message ? data.message : '';
    logData.error = data && data.error ? data.error : '';
    let logFolder = 'public/logs/crm';
    mkDirByPathSync(logFolder);

    let filename = logFolder+ "/" + moment().format('YYYY-MM-DD') + '.log';
    let log = typeof logData == "string" ? logData : JSON.stringify(logData);
    if (fs.existsSync(filename)) {
        fs.appendFile(filename, "\n" + log, function (err) {
            if (err) {throw err;}
        });
    } else {
        fs.appendFile(filename, log, function (err) {
            if (err) {throw err;}
        });
    }
}

async function logMobileEvents(requestData, resp, time, errorData) {
    if (errorData) {resp.statusCode = errorData.statusCode;}

    mkDirByPathSync('public/logs/mobile/rawfiles');
    let uploadFile = requestData.files.file;
    let fileName = uploadFile.name;
    removeFile('public/logs/mobile/rawfiles/' + fileName);
    uploadFile.mv('public/logs/mobile/rawfiles/' + fileName, async function (err) {
        if (err) {throw err;}
    });
    fs.readFile('public/logs/mobile/rawfiles/' + fileName, 'utf8', function(err, contents) {
        let filenameLog = 'public/logs/mobile/' + moment().format('YYYY-MM-DD') + '.log';
        if (fs.existsSync(filenameLog)) {
            fs.appendFile(filenameLog, "\n" + contents, function (err) {
                if (err) {throw err;}
            });
        } else {
            fs.appendFile(filenameLog, contents, function (err) {
                if (err) {throw err;}
            });
        }
    });
}

module.exports = {
    logApiRequest,
    logCrmEvents,
    logMobileEvents
};