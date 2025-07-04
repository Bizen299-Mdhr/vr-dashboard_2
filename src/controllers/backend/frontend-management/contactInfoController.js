const Controller = require('@baseController');
const { logCrmEvents } = require("@lib");
class contactInfoController extends Controller {
    constructor(opts) {
        super(opts);
        this.service = opts.contactInfoService;
        this.title = 'Contact Information';
        this.view = '../contact-info';
        this.url = '/system/contact-info';
        this.module = 'frontend-management.contact-info.';
    }


    async index(req, res) {
        try {
     
            this.innerPage = this.view + '/index';
            const editPageData = {
                admin: await this.service.find({ where: { id: 1 } })
            };
            res.render('layout/base-inner', this.viewData(editPageData, this.module + 'edit', this.title));
        } catch (error) {
            req.flash('error_msg', error.message);
            return res.redirect(this.url);
        }
    }
    async edit(req, res) {
        try {
            await this.service.updateContactInfo(req);
            logCrmEvents(req, "Event", "success", { message: this.title + " updated" });
            req.flash('success_msg', 'About page info updated Successfully.');
            return res.redirect(this.url);
        } catch (error) {
            req.flash('error_msg', error.message);
            return res.redirect(this.url);
        }
    }


}

module.exports = contactInfoController;
