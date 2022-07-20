// <APP ROOT>/config/log4js-config.js
const fs = require('fs');
const yaml = require('js-yaml');

const yamlText = fs.readFileSync(__dirname+"/../config/log4js.yml", 'utf8');
const setting = yaml.load(yamlText);

module.exports = setting;


