const Controller = require('@apiBaseController');
class ApiUserController extends Controller {
    constructor(opts) {
        super(opts);
        this.service = opts.apiUserService;
        this.transformer = opts.userTransformer;
    }
    async register(req, res){
        let user = await this.service.register(req.body);
        return this.respondWithItem(res, await this.transformer.transformUser(user));
    }

    async updateUser(req, res){
        let user = await this.service.findAndUpdate(req.params.id, req.body);
        return this.respondWithItem(res, await this.transformer.transformUser(user));
    }

    async deleteUser(req, res){
        await this.service.delete(req.params.id);
        return this.noContent(res);
    }

    async getAllUsers(req, res){
        let users = await this.service.getData(req);
        return this.respondWithPagination(res, await this.transformer.transformMultiplUser(users.docs), users.pagination);
    }

    async getUserbyId(req, res) {
        let user = await this.service.findOne({ where: { _id: req.params.id } });
        return this.respondWithItem(res, await this.transformer.transformUser(user));
    }
}

module.exports = ApiUserController;


