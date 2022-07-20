
const http = require("http-status-codes");

class ApiAuthController {
    constructor({bindAll, container}){
        this.container = container;
        this.service = container.resolve('apiAuthService');
        bindAll(this, ApiAuthController.prototype);
    }

    async logout(req, res){
        await this.service.performLogout(req?.headers?.authorization);
        return res.status(http.StatusCodes.NO_CONTENT).send({});
    }
}

module.exports = ApiAuthController;