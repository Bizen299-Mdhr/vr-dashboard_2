const Controller = require('@baseController');
const { logCrmEvents } = require("@lib");
class resumeController extends Controller {
    constructor(opts) {
        console.log(opts);
        super(opts);
        this.service = opts.resumeService;
        this.title = 'Resume';
        this.view = '../resume';
        this.url = '/system/resume';
        this.module = 'frontend-management.resume.';
    }


    async index(req, res) {
        
        try {
     
            this.innerPage = this.view + '/index';
            const editPageData = {
                admin: await this.service.find({ where: { id: 1 } }),
                work_experience_detail: await this.service.findAll({ where: { type: "work-experience" } }),
                education_detail: await this.service.findAll({ where: { type: "education" } })

            };
            
            res.render('layout/base-inner', this.viewData(editPageData, this.module + 'edit', this.title));
        } catch (error) {
            req.flash('error_msg', error.message);
            return res.redirect(this.url);
        }
    }
    async edit(req, res) {
        try {
            await this.service.updateResumePageInfo(req);
            logCrmEvents(req, "Event", "success", { message: this.title + " updated" });
            req.flash('success_msg', 'About page info updated Successfully.');
            return res.redirect(this.url);
        } catch (error) {
            req.flash('error_msg', error.message);
            req.flash('inputData', req.body);
            return res.redirect(this.url);
        }
    }


}

module.exports = resumeController;
