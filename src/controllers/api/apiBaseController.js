const http = require("http-status-codes");
const { responseFormat } = require('@responseFormat');
class ApiBaseController {
    constructor({bindAll, container}){
        this.container = container;
        bindAll(this, ApiBaseController.prototype);
    }

    respondWithItem(res, data){
        return res.status(http.StatusCodes.OK).send(responseFormat(data));
    }
    
    respondWithPagination(res, data, pagination){
        return res.status(http.StatusCodes.OK).send(responseFormat(data, pagination));
    }

    respondWithOutPagination(res, data){
        return res.status(http.StatusCodes.OK).send(responseFormat(data));
    }

    noContent(res){
        return res.status(http.StatusCodes.NO_CONTENT).send({});
    }

    repondOk(res){
        return res.status(http.StatusCodes.OK).send({});
    }
}

module.exports = ApiBaseController;