const moment = require("moment");

function required(attr, value) {
    let error = false;
    if (value == undefined) {
        error = true;
    } else if (typeof value === 'string' && value.trim() === "" ) {
        error = true;
    }else if (typeof value === 'object' && value.length === 0) {
        error = true;
    }
    if (error) {
        const message = "is a required field.";
        throw new Error(`${attr} ` + `${message}`);
    }
}

function checkMaxLength(attr, value, maxLength = 50, removeNewLine) {
    if (value && removeNewLine === true) {
        value = value.replace(/(\r\n|\n|\r)/gm, "");
    }
    if (value && value.trim().length > maxLength) {
        const message = `must not exceed ${maxLength} characters.`;
        throw new Error(`${attr} ` + `${message}`);
    } else {
        return true;
    }
}

function numeric(attr, value) {
    if (value) {
        if (!new RegExp(/^\d+([.]?\d{0,3})?$/g).test(value) && new RegExp(/\D/g).test(value)) {
            let message = "must be only numeric value.";
            throw new Error(`${attr}` + `${message}`);
        }
    }
}

function acceptNumeric(attr, value) {
    if (value) {
        if (!new RegExp(/^-?\d+([.]?\d{0,3})?$/g).test(value) && new RegExp(/\D/g).test(value)) {
            const message = "must be only numeric value.";
            throw new Error(`${attr}` + `${message}`);
        }
    }
}

function alphaNumeric(attr, value) {
    if (value && !new RegExp("^[a-zA-Z0-9-#@*&]*$").test(value)) {
        const message ="must contain only a-z, A-Z, 0-9, (#@*&).";
        throw new Error(`${attr}` + `${message}`);
    }
}

function maxLength(attr, value, length = 50) {
    if (value && value.length > length) {
        let message = `must not exceed ${length} characters.`;
        throw new Error(`${attr}` + `${message}`);
    }
}

function between(attr, value, min = 8, max = 12) {
    if (value && value !== "" && value.length < min || value.length > max) {
        const message = `length must be between ${min} - ${max}.`;
        throw new Error(`${attr}` + ` ${message}`);
    }
}

function onlyNum(attr, value) {
    if (value && value !== "" && /\D/g.test(value)) {
        const message = "must contain only numbers.";
        throw new Error(`${attr}` + `${message}`);
    }
}

function onlyNumIncludeDash(attr, value){
    if (value && value !== "" && !/^[0-9-]*$/.test(value)) {
        const message = "must contain only numbers and dash.";
        throw new Error(`${attr}` + ` ${message}`);
    }
}

function validateUuidv4(uuid) {
    let uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    return uuidRegex.test(uuid);
}

function validateDateTimeFormat(dateTime, format = ["YYYY/MM/DD HH:mm"], text = '') {
    if (dateTime && dateTime !== "" && !moment(dateTime, format, true).isValid()) {
        const proMsg = text;
        const message = "Invalid date";
        throw new Error(`${proMsg}` + ` ${message}`);
    }
}

function validateDate(msg, value) {
    if (value && !moment(value, "YYYY/MM/DD", true).isValid() && !moment(value, "YYYY-MM-DD", true).isValid()) {
        throw new Error(msg);
    }
    return true;
}

function genericError(msg) {
    throw new Error(msg);
}

function checkHalfWidthKana(value) {
    let halfWidthKana = [
        "ｶﾞ", "ｷﾞ", "ｸﾞ", "ｹﾞ", "ｺﾞ",
        "ｻﾞ", "ｼﾞ", "ｽﾞ", "ｾﾞ", "ｿﾞ",
        "ﾀﾞ", "ﾁﾞ", "ﾂﾞ", "ﾃﾞ", "ﾄﾞ",
        "ﾊﾞ", "ﾋﾞ", "ﾌﾞ", "ﾍﾞ", "ﾎﾞ",
        "ﾊﾟ", "ﾋﾟ", "ﾌﾟ", "ﾍﾟ", "ﾎﾟ",
        "ｳﾞ", "ﾜﾞ", "ｦﾞ",
        "ｱ", "ｲ", "ｳ", "ｴ", "ｵ",
        "ｶ", "ｷ", "ｸ", "ｹ", "ｺ",
        "ｻ", "ｼ", "ｽ", "ｾ", "ｿ",
        "ﾀ", "ﾁ", "ﾂ", "ﾃ", "ﾄ",
        "ﾅ", "ﾆ", "ﾇ", "ﾈ", "ﾉ",
        "ﾊ", "ﾋ", "ﾌ", "ﾍ", "ﾎ",
        "ﾏ", "ﾐ", "ﾑ", "ﾒ", "ﾓ",
        "ﾔ", "ﾕ", "ﾖ",
        "ﾗ", "ﾘ", "ﾙ", "ﾚ", "ﾛ",
        "ﾜ", "ｦ", "ﾝ",
        "ｧ", "ｨ", "ｩ", "ｪ", "ｫ",
        "ｯ", "ｬ", "ｭ", "ｮ",
        "｡", "､", "ｰ", "｢", "｣", "･", " ", "ﾞ", "ﾟ", "(", ")"
    ];
    let status;
    for (let i = 0; i < value.length; i++) {
        if (halfWidthKana.find(v => (value.charAt(i) === v))) {
            status = true;
        } else {
            status = false;
            return status;
        }
    }

    return status;
}

module.exports = {
    required,
    checkMaxLength,
    numeric,
    alphaNumeric,
    maxLength,
    validateUuidv4,
    validateDateTimeFormat,
    validateDate,
    acceptNumeric,
    checkHalfWidthKana,
    genericError,
    between,
    onlyNum,
    onlyNumIncludeDash
};