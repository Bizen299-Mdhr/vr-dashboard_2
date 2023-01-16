const BaseService = require('@baseService');
const {
    admin, role, resetPasswordHistory,userRole
} = require('@models');
const randtoken = require('rand-token');
const PROTECTED_ATTRIBUTES = ['password'];
const {bcryptPassword, getConfigData, uplaodFileToPath} = require("@lib");
const bcrypt = require('bcryptjs');
const config = require('@config');
const {MAINSUPERADMIN} = require('@constant');
const db = require("@db").postgres;
const sequelize = require('sequelize');
const {Op} = sequelize;
const {emitter} = require('@emitter');
class AdminService extends BaseService {
    constructor() {
        super(admin);
        this.filterFields = [
            'first_name', 'email'
        ];
    }

    get emailService() {
        return this._emailService;
    }

    set emailService(value) {
        this._emailService = value;
    }

    getData(req) {
        const payload = {
            ...this.buildFilterQuery(req),
            order: this.masterDataOrderAndSort(req.query.order || 'created_at', req.query.sort),
            page: req.query.page ?? 1,
            include: [{
                model: userRole, as: "userRoles",
                include: [
                    {
                        model: role, as: "roleAdmin"
                    }
                ]
            }]
        };
        return this.getPaginatedData(payload);
    }

    async indexPageData(req) {
        return {
            ...await this.getData(req)
        };
    }

    buildFilterQuery(req) {
        let filter = {};
        let keywordFilter = {};
        const {query} = req;
        if (!query) {
            return filter;
        }
        if (query) {
            if (query.keyword) {
                keywordFilter[Op.or] = this.buildKeywordQuery(query.keyword);
            }
            if (query.department) {
                filter['department_id'] = query.department;
            }
            if(!query.include_inactive){
                filter['status'] = {[Op.ne]: 'inactive'};
            }
        }
        const finalMappedFilter = {
            ...keywordFilter,
            ...filter
        };
        return {where: finalMappedFilter};
    }

    async create(data, trx) {
        let user = await admin.create(data, {transaction: trx});
        return user;
    }

    async findOne(query) {
        let user = await admin.findOne({
            where: query.where,
            attributes: {exclude: PROTECTED_ATTRIBUTES}
        });
        return user;
    }

    async findUserWithRole(query) {
        return await admin.findOne({
            where: query.where,
            attributes: {exclude: PROTECTED_ATTRIBUTES},
            include: [{
                model: role,
                as: "role",
                attributes: ['_id', 'name', 'slug', 'permission']
            }]
        });
    }

    async findUserWithRoles(query) {
        let user = await admin.findOne({
            where: query.where,
            attributes: {exclude: PROTECTED_ATTRIBUTES},
            include: [{model: userRole, as: "userRoles"}]
        });
        return user;
    }

    async findAllUserWithRole(query) {
        let user = await admin.findAll({
            where: query.where,
            attributes: {exclude: PROTECTED_ATTRIBUTES},
            include: [{model: role, as: "role"}]
        });
        return user;
    }

    async selectedRoleIds(userid) {
        let roleIds = [];
        const data = await userRole.findAll({
            where: {
                user_id: userid
            },
            attributes: ['role_id']
        });
        data.map(role => {
            roleIds.push(role.role_id);
        });
        return roleIds;
    }

    async delete(id) {
        const trx = await db.transaction();
        try{
            const adminData = await this.model.findOne({
                where: {_id: id}
            });
            if(adminData === null){
                throw new Error('Data not found.');
            }
            if(adminData._id === MAINSUPERADMIN){
                throw new Error('Main Superadmin data cannot be deleted.');
            }
            await userRole.destroy({where:{
                user_id:adminData.id
            }, transaction:trx});
            await adminData.destroy({transaction: trx});
            return await trx.commit();
        }catch(err){
            await trx.rollback();
            throw new Error(err);
        }
    }

    async createUser(req) {
        const trx = await db.transaction();
        try {
            let imageName = '';
            if (req.files) {
                imageName = await uplaodFileToPath(req, 'public/backend', '/uploads/admins/');
            }
            let passwordMethod = req.body.password_method;
            let newUser = this.parseAdminData(req.body, 'create');
            newUser['image'] =  imageName;
            newUser['password_method'] = passwordMethod;
            let token = "";
            if (passwordMethod == "is_activation_link") {
                let expiryDate = new Date().getTime() + config.token.expiry;
                token = randtoken.generate(24);
                newUser['reset_password_token'] = token;
                newUser['reset_password_expires'] = new Date(expiryDate);
                newUser['status'] = 'active';
            } else {
                let hashround = 10;
                if (getConfigData(req, "Password Hashing Rounds") && getConfigData(req, "Password Hashing Rounds") !== "") {
                    hashround = parseInt(getConfigData(req, "Password Hashing Rounds"));
                }
                newUser['password'] = bcryptPassword(req.body.password, hashround);
            }
            let admin = await this.create(newUser, trx);
            await this.updateUserRoles(admin.id, req.body.role_id, trx, 'create');
            await trx.commit();
            if (admin && passwordMethod == "is_activation_link") {
                emitter.emit('create-user', {
                    email: [newUser.email],
                    token: newUser.reset_password_token,
                    username: newUser.username,
                    code: 'email_verification',
                    url: process.env.CMSURL + '/reset-password/' + newUser.reset_password_token
                });

            }
        } catch (err) {
            await trx.rollback();
            throw new Error(err);
        }
    }

    async updateUser(req) {
        const trx = await db.transaction();
        try {
            let updateData = this.parseAdminData(req.body, 'update');
            if (req.files) {
                let imageName = await uplaodFileToPath(req, 'public/backend', '/uploads/admins/');
                updateData['image'] = imageName;
            }
            let updatedUser = await admin.update(updateData, {where: {_id: req.params.id}, individualHooks: true, transaction: trx});

            if(updatedUser[1][0]._id !== MAINSUPERADMIN){
                await this.updateUserRoles(updatedUser[1][0].id, req.body.role_id, trx);
            }

            await trx.commit();
            if (updatedUser[1][0]._id == req.session.user._id) {
                req.session.user.first_name = updatedUser[1][0].first_name;
                req.session.user.last_name = updatedUser[1][0].last_name;
                req.session.user.image = updatedUser[1][0].image;
            }
            return updatedUser;
        } catch (e) {
            await trx.rollback();
            throw new Error(e);
        }
    }

    parseAdminData(data, action){
        const parsed = {
            'first_name': data.first_name,
            'last_name': data.last_name,
            'email': data.email,
            'username': data.username,
            'contact_number': data.contact_number,
            'status': data.status,
            'mobile_num': data.mobile_num,
            'remarks': data.remarks,
            'fax': data.fax
        };
        if(action === 'create'){
            parsed['created_at'] =  new Date();
        }
        if(action === 'update'){
            parsed['updated_at'] = new Date();
        }
        return parsed;
    }

    async updateUserRoles(userId, roles, trx, mode = "edit") {
        let mappedRoles = roles;
        const arrayData = [];
        if (typeof (roles) === "string") {
            mappedRoles = [roles];
        }
        if (mode === "edit") {
            await userRole.destroy({where: {user_id: userId}, transaction: trx});
        }
        for (let i = 0; i < mappedRoles.length; i++) {
            const roleData = await role.findOne({where: {id: mappedRoles[i]}});
            const data = {
                user_id: userId,
                role_id: parseInt(mappedRoles[i]),
                role_slug: roleData.slug
            };
            arrayData.push(data);
        }
        return await userRole.bulkCreate(arrayData, {transaction: trx});
    }

    async storePasswordHistory(payload, trx) {
        return await resetPasswordHistory.create(payload, {transaction:trx});
    }

    async checkRecentOldPasswords(req, token, password) {
        let check = false;
        const admin = await this.findOne({where: {'reset_password_token': token}});
        let limit = 3;
        if (getConfigData(req, "Past Password Usage Restrictions") && getConfigData(req, "Past Password Usage Restrictions") !== "") {
            limit = getConfigData(req, "Password Hashing Rounds") ? parseInt(getConfigData(req, "Password Hashing Rounds")) : limit;
        }
        const passwordHistories = await resetPasswordHistory.findAll(
            {
                where: {"user_id": admin._id},
                attributes: ["user_id", "password"],
                limit: limit,
                order: [['created_at', 'DESC']]
            });

        const totalRecord = await resetPasswordHistory.count(
            {where: {"user_id": admin._id}});

        for (let i = 0; i < totalRecord; i++) {
            if (passwordHistories[i]) {
                if (bcrypt.compareSync(password, passwordHistories[i].password)) {
                    check = true;
                    break;
                }
            }
        }
        return check;
    }

    async getDropDownData() {
        const filterObject = {
            where:{
                _id:{
                    [Op.ne]:MAINSUPERADMIN
                }
            },
            attributes: ['id', 'first_name','last_name', 'status']
        };
        return await this.model.findAll(filterObject);
    }
}

module.exports = AdminService;