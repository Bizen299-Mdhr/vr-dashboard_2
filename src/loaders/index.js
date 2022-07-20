const expressLoader =  require('./express');
const localFunctionLoader =  require('./locals');
const { containerSetup } = require("@container");

let init = async (app) => {
    await containerSetup(app);
    await expressLoader.init(app);
    await localFunctionLoader.init(app);
};

module.exports = { init };