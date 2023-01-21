const Controller = require('@baseController');
const { logCrmEvents } = require("@lib");
class portfolioController extends Controller {
    constructor(opts) {
        super(opts);
        this.service = opts.portfolioService;
        this.title = 'Portfolio';
        this.view = '../portfolio';
        this.url = '/system/portfolio';
        this.module = 'frontend-management.portfolio.';
    }


    async index(req, res) {
        try {
            this.innerPage = this.view + '/index';
            req.query.sort = req.query.sort ? req.query.sort:'ASC';
            req.query.order = req.query.order ? req.query.order:'position';
            const data = await this.service.indexPageData(req);
            data.breadcrumbs = this.indexBreadCrumb();
            req.session.cancelUrl = req.originalUrl;
            return res.render('layout/base-inner', this.viewData(data, this.module + 'view'));
        } catch (error) {
            req.flash('error_msg', error.message);
            return res.redirect(this.url);
        }
    }

    async add(req, res) {
        try {
            await this.service.create(req);
            logCrmEvents(req, "Add " + this.title, "success", {message: this.title});
            req.flash('success_msg', this.title + ' added successfully.');
            return res.redirect(this.url);
        } catch (error) {
            req.flash('inputData', req.body);
            req.flash('error_msg', error.message);
            return res.redirect('back');
        }
    }

    async edit(req, res) {
        try {
            await this.service.updatePortfolioInfo(req);
            logCrmEvents(req, "Event", "success", { message: this.title + " updated" });
            req.flash('success_msg', 'About page info updated Successfully.');
            return res.redirect(this.url);
        } catch (error) {
            req.flash('error_msg', error.message);
            return res.redirect(this.url);
        }
    }   
    async updatePosition(req, res) {
        try {
            await this.service.updatePos({position: parseInt(req.body.position)},req.body.column);
            logCrmEvents(req, "Event", "success", { message: this.title + " updated" });
            req.flash('success_msg', 'About page info updated Successfully.');
            return res.redirect(this.url);
        } catch (error) {
            req.flash('error_msg', error.message);
            return res.redirect(this.url);
        }
    }


}

module.exports = portfolioController;
