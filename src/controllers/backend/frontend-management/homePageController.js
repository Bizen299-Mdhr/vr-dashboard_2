const Controller = require('@baseController');
const { logCrmEvents } = require("@lib");
class homePageController extends Controller {
    constructor(opts) {
        super(opts);
        this.service = opts.homeService;
        this.title = 'Home Page Information';
        this.view = '../home-page';
        this.url = '/system/home-page';
        this.module = 'frontend-management.home-page.';
    }


    async index(req, res) {
        try {
            this.innerPage = this.view + '/index';
            const editPageData = {
                admin: await this.service.find({where:{id:1}})
            };
            logCrmEvents(req, "Page Visit", "success", { message: 'Edit Home Page' });
            res.render('layout/base-inner', this.viewData(editPageData, this.module + 'edit', this.title));
        } catch (error) {
            req.flash('error_msg', error.message);
            return res.redirect(this.url);
        }
    }
    async edit(req, res) {
        try {
            await this.service.updateHomePageInfo(req);
            logCrmEvents(req, "Event", "success", { message: this.title + " updated" });
            req.flash('success_msg', 'Home page info updated Successfully.');
            return res.redirect(this.url);
        } catch (error) {
            req.flash('error_msg', error.message);
            return res.redirect(this.url);
        }
    }


}

module.exports = homePageController;
