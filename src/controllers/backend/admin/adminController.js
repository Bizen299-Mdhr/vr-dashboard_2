const {removeFile, logCrmEvents, bcryptPassword, getConfigData} = require('@lib');
const Controller = require('@baseController');
const {department} = require('@models');
const {emitter} = require('@emitter');
class AdminController extends Controller {
    constructor(opts) {
        super(opts);
        this.model = department;
        this.service = opts.adminService;
        this.roleService = opts.roleService;
        this.title = 'Admins';
        this.view = '../admin';
        this.url = '/admins';
        this.module = 'user-management.admins';
    }

    async index(req, res) {
        try {
            this.innerPage = this.view + '/index';
            const data = await this.service.indexPageData(req);
            data.breadcrumbs = this.indexBreadCrumb();
            logCrmEvents(req, "Page Visit", "success", {message: this.title});
            req.session.cancelUrl = req.originalUrl;
            return res.render('layout/base-inner', this.viewData(data, this.module + 'view'));
        } catch (error) {
            req.flash('error_msg', error.message);
            return res.redirect(this.url);
        }
    }

    async addView(req, res) {
        try {
            this.innerPage = this.view + '/add';
            const roles = await this.roleService.getAll(req);
            const breadcrumbs = this.formBreadCrumb("Create");

            const createPageData = {
                roles: roles.docs, 
                breadcrumbs:breadcrumbs
            };
            logCrmEvents(req, "Page Visit", "success", {message: this.title});
            res.render('layout/base-inner', this.viewData(createPageData, this.module +  'create','Add Admin'));
        } catch (error) {
            req.flash('error_msg', error.message);
            return res.redirect(this.url);
        }
    }

    async add(req, res) {
        try {
            await this.service.createUser(req, req.session.user);
            logCrmEvents(req, "Add Admin", "success", {message: this.title});
            req.flash('success_msg', 'Admin added successfully.');
            return res.redirect(this.url);
        } catch (error) {
            req.flash('error_msg', error.message);
            return res.redirect(this.url+'/create');
        }
    }

    async editView(req, res) {
        try {
            this.innerPage = this.view + '/edit';
            const adminData = await this.service.findOne({where: {_id: req.params.id}});
            const rolesPromise = this.roleService.getAll(req);
            const userRolesIdsPromise = this.service.selectedRoleIds(adminData.id);
            const [roles, userRolesIds] = await Promise.all([rolesPromise, userRolesIdsPromise]);
            const breadcrumbs = this.formBreadCrumb("Edit", req?.session?.cancelUrl);
            const editPageData = {
                roles: roles.docs, 
                admin: adminData,
                selectedRoles:userRolesIds,
                breadcrumbs:breadcrumbs
            };
            logCrmEvents(req, "Page Visit", "success", {message: 'Edit Admin'});
            res.render('layout/base-inner', this.viewData(editPageData, this.module +  'edit','Edit Admin'));
        } catch (error) {
            req.flash('error_msg', error.message);
            return res.redirect(this.url);
        }
    }

    async edit(req, res) {
        try {
            const updatedData = await this.service.updateUser(req, req.session.user);
            const _id = updatedData?.[1]?.[0]._id;
            logCrmEvents(req, "Event", "success", {message: "Employee updated"});
            req.flash('success_msg', 'Admin updated successfully');
            return res.redirect(_id ? this.url+`/${_id}`:this.url);
        } catch (error) {
            req.flash('error_msg', error.message);
            return res.redirect(this.url);
        }
    }

    async delete(req, res) {
        try {
            let admin = await this.service.findOrFail(req.params.id);
            if (admin.image) {
                let rootDir = 'public/backend';
                removeFile(rootDir + admin.image);
            }
            await this.service.delete(req.params.id);
            logCrmEvents(req, "Delete Admin", "success", {message: "Admin Delete"});
            req.flash('success_msg', 'Admin deleted successfully');
            return res.redirect(this.url);
        } catch (error) {
            req.flash('error_msg', error.message);
            return res.redirect(this.url);
        }
    }

    async changePasswordView(req, res) {
        try {
            this.innerPage = this.view + '/changePassword';
            const admin = await this.service.findOne({where: {_id: req.params.id}});
            const breadcrumbs = this.formBreadCrumb("Change Password");
            logCrmEvents(req, "Page Visit", "success", {message: this.title});
            return res.render('layout/base-inner', this.viewData({admin: admin, breadcrumbs}, 'password','Change Password'));
        } catch (error) {
            req.flash('error_msg', error.message);
            return res.redirect(this.url);
        }
    }

    async changePassword(req, res) {
        try {
            let showResetPassword = false;
            if(req.body.show_reset_password){
                showResetPassword = true;
            }
            let hashround = 10;
            if(getConfigData(req, "Password Hashing Rounds") && getConfigData(req, "Password Hashing Rounds")!==""){
                hashround = parseInt(getConfigData(req, "Password Hashing Rounds"));
            }
            const data = await this.service.findAndUpdate(req.params.id, {password: bcryptPassword(req.body.password, hashround), show_reset_password:showResetPassword, updated_at: new Date()});
            emitter.emit('notify-password-changed', {
                email: [data?.[1]?.[0]?.email],
                code: 'notify_password_changed',
                username: data?.[1]?.[0]?.employee_name,
                password: req.body.password
            });
            logCrmEvents(req, "Event", "success", {message: "Admin password changed"});
            req.flash('success_msg', 'Password changed successfully');
            return res.redirect(this.url);
        } catch (error) {
            req.flash('error_msg', error.message);
            return res.redirect(this.url);
        }
    }
}

module.exports = AdminController;


