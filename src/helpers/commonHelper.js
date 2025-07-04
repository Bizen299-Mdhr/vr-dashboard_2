const axios = require('axios');
const crypto = require('crypto');
const momenttz = require('moment-timezone');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const {postgres} = require('../database/database');
const path = require("path");

function generateRandomString(stringLength) {
    let randomString = '';
    let asciiLow = 65;
    let asciiHigh = 90;

    for (let i = 0; i < stringLength; i++) {
        let randomAscii = Math.floor((Math.random() * (asciiHigh - asciiLow)) + asciiLow);
        randomString += String.fromCharCode(randomAscii);
    }

    return randomString + crypto.randomBytes(10).toString("hex");

}

function isEmailValid(email) {
    let emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
}


function compare(arr1, arr2) {
    if (!arr1 || !arr2) {
        return;
    }
    let result;
    arr1.forEach((e1) => arr2.forEach(e2 => {
        if (e1.length > 1 && e2.length) {
            result = compare(e1, e2);
        } else if (e1 !== e2) {
            result = false;
        } else {
            result = true;
        }
    })
    );

    return result;
}

function generateToken(length) {
    let buf = [],
        chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        charlen = chars.length;

    for (let i = 0; i < length; ++i) {
        buf.push(chars[getRandomInt(0, charlen - 1)]);
    }
    return buf.join('');
}

function getClientIpAddress(req) {
    let ipAddress;
    // The request may be forwarded from local web server.
    const forwardedIpsStr = req.header('x-forwarded-for');
    if (forwardedIpsStr) {
        // 'x-forwarded-for' header may return multiple IP addresses in
        // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
        // the first one
        const forwardedIps = forwardedIpsStr.split(',');
        ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
        // If request was not forwarded
        ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
}

async function mapIpToLocation(ip) {
    let location = null;
    try {
        const response = await axios.get(`http://ip-api.com/json/${ip}`);
        if (response.data.status === 'success') {
            location = {
                country: response.data.country,
                city: response.data.city
            };
        }
    } catch (e) {
        console.log(e);
    }
    return location;
}

function arrayFlattern(array) {
    return Array.prototype.concat.apply([], array);
}

function randomValueBase64(len) {
    return crypto.randomBytes(Math.ceil(len * 3 / 4))
        .toString('base64')   // convert to base64 format
        .slice(0, len)        // return required number of characters
        .replace(/\+/g, '0')  // replace '+' with '0'
        .replace(/\//g, '0'); // replace '/' with '0'
}

let getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

function generateRandomCode(n) {
    let add = 1, max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.

    if (n > max) {
        return generateRandomCode(max) + generateRandomCode(n - max);
    }

    max = Math.pow(10, n + add);
    let min = max / 10; // Math.pow(10, n) basically
    let number = Math.floor(Math.random() * (max - min + 1)) + min;

    return ("" + number).substring(add);

}

async function capitalizeName(name) {
    return name.replace(/\b(\w)/g, s => s.toUpperCase());
}

let dateDiffIndays = function (date1, date2) {
    let dt1 = new Date(date1);
    let dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
};

function timeDifference(datetime1, dateTime2) {
    let diff = dateTime2.getTime() - datetime1.getTime();
    let msec = diff;
    let hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    let mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    let ss = Math.floor(msec / 1000);
    msec -= ss * 1000;
    return hh + ":" + mm + ":" + ss + ":" + msec;
}

function greetByHr() {
    let hrs = momenttz().tz("Asia/Kathmandu").format("H");
    let greet = '';
    if (hrs < 12) {
        greet = 'Good Morning';
    } else if (hrs >= 12 && hrs <= 17) {
        greet = 'Good Afternoon';
    } else if (hrs >= 17 && hrs <= 24) {
        greet = 'Good Evening';
    }
    return greet;
}


function distance(lat1, lon1, lat2, lon2, unit) {
    let radlat1 = Math.PI * lat1 / 180;
    let radlat2 = Math.PI * lat2 / 180;
    let theta = lon1 - lon2;
    let radtheta = Math.PI * theta / 180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit === "K") {
        dist = dist * 1.609344;
    }
    if (unit === "N") {
        dist = dist * 0.8684;
    }
    return dist;
}


function removeJsonInarrayByValue(array, key, value) {
    return array.filter(function (a) {
        return a[key] !== value;
    });
}

function convertIptoNumber(ip) {
    return ip.split(".").map(d => ("000" + d).substr(-3)).join("");
}

function getipAddress(req) {
    let ip = (req.headers['x-forwarded-for'] || '').split(',').pop() ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    return ip;
}

function getConfigData(req, configName) {
    const configData = req.session.configData;
    let obj = configData.find(o => o.name === configName);
    return obj?.value;
}

function bcryptPassword(password, hashRound) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(hashRound), null);
}

function removeBlankEntriesAndConvertToFloatWhereNeeded(data) {
    let formattedData = {};
    Object.keys(data).map((k) => {
        let val = data[k];
        if (typeof data[k] === 'object') {
            formattedData[k] = data[k];
        } else {
            if (val === "" || val === undefined) {
                val = null;
            }
            if (val !== "") {
                // let regexp = /^-?\d*\.{0,1}\d+$/;
                let regexp = /^-?\d+(\.\d{1,2})?$/;
                if (regexp.test(val)) {
                    if(val.length < 20){ //when textarea input is only integer number
                        val = parseFloat(val);
                    }
                }
            }
            formattedData[k] = val;
        }
    });
    return formattedData;
}

function removeBlankEntries(data) {
    let formattedData = {};
    Object.keys(data).map((k) => {
        let val = data[k];
        if(typeof data[k] === 'string'){
            formattedData[k] = val ? val.trim() : null;
        }else{
            formattedData[k] = val;
        }        
    });
    return formattedData;
}

function base64encode(data) {
    return Buffer.from(data).toString('base64');

}

function base64decode(encode) {
    return Buffer.from(encode, 'base64').toString('utf-8');
}

function dynamicPerPage(perPage, max = 50, min = 10) {

    if (perPage > max) {
        perPage = 50;
    }
    if (perPage < min) {
        perPage = 10;
    }
    return perPage;
}

function getColumnName(column) {
    return `${column.column_comment ? column.column_comment : column.column_name}`;
}

function daysInAYear(year) {
    return isLeapYear(year) ? 366 : 365;
}

function isLeapYear(year) {
    return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
}

function convertToJapaneseTimezone(date, format) {
    return moment(date).tz('Asia/Tokyo').format(format);
}

async function refreshMaterializedView(viewName, trx) {
    const checkQuery = `select count(*) from pg_matviews where matviewname = '${viewName}';`;
    const result = await postgres.query(checkQuery);
    if(result?.[0]?.[0]?.count !== "1"){
        return false;
    }
    return await postgres.query(`refresh materialized view ${viewName}`, {transaction: trx});
}

function parseMessage(content, msg) {
    return msg.replace('<%content%>', content);
}

/* eslint-disable no-unused-vars */
function arrayFromJSONkeyValueArray(jsonArray, key) {
    let newArray = [];
    for (const [i,data] of jsonArray.entries()) {
        if(data[key]){
            newArray.push(data[key]);
        }
    }
    return newArray;
}

function viewsPath(relativeViewPath = null){
    let resolvedPath = path.join(__dirname, "../../src/views/backend");
    if (relativeViewPath) {
        if (path.isAbsolute(relativeViewPath)) {
            throw new Error(
                "viewsPath accepts relative path only. Absolute path is given"
            );
        }
        resolvedPath = path.join(resolvedPath, relativeViewPath);
    }
    return resolvedPath;
}
function hyphanize(string, position){
    return  [string.slice(0, position), '-', string.slice(position)].join('');
}

function hasSuperAdminRole(user){
    let check = false;
    if (user && (user?.role && user?.role?.slug.trim() === 'superadmin') ||
    (user?.userRoles && user?.userRoles.find(o => o.role_slug.trim() === 'superadmin') !== undefined)) {
        check =  true;
    }
    return check;
}

function isApiRequestOrAjax(req){
    let check = false;
    const requestTypes = [
        "application/json", "application/json; charset=utf-8"
    ];

    if(requestTypes.includes(req?.headers.accept) || requestTypes.includes(req?.headers?.["content-type"])|| req.xhr){
        check = true;
    }
    return check;
}

module.exports = {
    distance,
    dateDiffIndays,
    removeJsonInarrayByValue,
    greetByHr,
    mapIpToLocation,
    randomValueBase64,
    generateToken,
    compare,
    generateRandomString,
    getClientIpAddress,
    isEmailValid,
    generateRandomCode,
    capitalizeName,
    arrayFlattern,
    timeDifference,
    convertIptoNumber,
    getipAddress,
    getConfigData,
    bcryptPassword,
    removeBlankEntriesAndConvertToFloatWhereNeeded,
    removeBlankEntries,
    base64encode,
    base64decode,
    dynamicPerPage,
    getColumnName,
    refreshMaterializedView,
    convertToJapaneseTimezone,
    daysInAYear,
    parseMessage,
    arrayFromJSONkeyValueArray, 
    viewsPath,
    hyphanize,
    hasSuperAdminRole,
    isApiRequestOrAjax
};