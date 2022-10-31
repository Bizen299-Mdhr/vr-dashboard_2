const Controller = require('@baseController');
const {logCrmEvents} = require("@lib");
class homePageController extends Controller {
    constructor(opts) {
        super(opts);
        this.service = opts.configService;
        this.title = 'Home Page Information';
        this.view = '../home-page';
        this.url = '/system/home-page';
        this.module = 'frontend-management.home-page.';
    }


    async index(req, res) {
        try {
            this.innerPage = this.view + '/index';
            // const adminData = await this.service.findOne({where: {_id: req.params.id}});
            // const rolesPromise = this.roleService.getAll(req);
            // const userRolesIdsPromise = this.service.selectedRoleIds(adminData.id);
            // const [roles, userRolesIds] = await Promise.all([rolesPromise, userRolesIdsPromise]);
            // const breadcrumbs = this.formBreadCrumb("Edit", req?.session?.cancelUrl);
            const editPageData = {
                admin: {},
                roles: [],
            };
            logCrmEvents(req, "Page Visit", "success", {message: 'Edit Home Page'});
            res.render('layout/base-inner', this.viewData(editPageData, this.module +  'edit',this.title));
        } catch (error) {
            req.flash('error_msg', error.message);
            return res.redirect(this.url);
        }
    }
    async edit(req, res) {
        try {
            const config = await this.service.findOne({where:{id:req.params.id}});
            if(!config){
                throw new Error("Configuration not found.");
            }
            const configedName = config.name;
            let error = false;
            let msg;

            if(req.body.checkbox && config.name == "Check Apartment Duplication"){
                req.session.configData = await this.updateAndFetch(req.params.id, {value:true});
                req.flash('success_msg', configedName + ' Updated Successfully.');
                return res.redirect('back');
            }
            if(!req.body.checkbox && !req.body.value && config.name == "Check Apartment Duplication"){
                req.session.configData = await this.updateAndFetch(req.params.id, {value:false});
                req.flash('success_msg', configedName + ' Updated Successfully.');
                return res.redirect('back');
            }

            if(!req.body.value){
                msg = `${configedName} is a required field.`;
                error = true;
            }

            if(!error && req.body.value && req.body.value !== ""){
                if(/\D/g.test(req.body.value) 
                && (configedName !== "Null Field" 
                && configedName !== "Assessment Gdrive Folder"
                && configedName !== "Assessment Gdrive Path"
                )){
                    msg = `${configedName} value must be only positive numbers.`;
                    error = true;
                }
                if(!error && req.body.value <= 0){
                    msg = `${configedName} value must be at-least 1.`;
                    error = true;
                }
            }
          
            if(!error && configedName === "Password Hashing Rounds" && (req.body.value > 15 || req.body.value < 4)){
                msg = `${configedName} range must be between 4-15.`;
                error = true;
            }
            if(!error && configedName === "Syncing Retry Times For Rakumo" && (req.body.value > 4 || req.body.value < 0)){
                msg = `${configedName} value must be between 1 - 4.`;
                error = true;
            }

            if(!error && configedName === "Null Feild Value" && req.body.value.length > 10){
                msg = `${configedName} must not excced 10 characters.`;
                error = true;
            }

            if(!error && configedName && req.body.value > 255 || req.body.value.length > 255){
                msg =  `${configedName} range is 255.`;
                error = true;
            }

            if(error){
                throw new Error(msg);
            }

            req.session.configData = await this.updateAndFetch(req.params.id, req.body);
            logCrmEvents(req, "Event", "success", {message: this.title + " updated"});
            req.flash('success_msg', configedName + ' Updated Successfully.');
            return res.redirect(this.url);
        } catch (error) {
            req.flash('error_msg', error.message);
            return res.redirect(this.url);
        }
    }


}

module.exports = homePageController;
