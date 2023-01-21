const Controller = require('@baseController');

class HomeController extends Controller {
    constructor(opts) {
        super(opts);
        this.service = opts.dashboardService;
        this.homeService = opts.homeService;
        this.aboutService = opts.aboutService;
        this.resumeService = opts.resumeService;
        this.portfolioService = opts.portfolioService;
        this.blogService = opts.blogService;
        this.contactService = opts.contactInfoService;
        this.title = 'Home';
        this.view = '../../frontend/home';
        this.url = '/home';
        this.module = 'home';
    }

    async index(req, res) {
        try {
            this.innerPage = this.view + '/index';
            const data = {
                homeInfo: await this.homeService.find({ where: { id: 1 } }),
                aboutInfo: await this.aboutService.find({ where: { id: 1 } }),
                resumeInfoTitle: await this.resumeService.find({ where: { id: 1 } }),
                resumeInfoEdu: await this.resumeService.findAll({ where: { type: 'education' }, order: [['position', 'asc']] }),
                resumeInfoWork: await this.resumeService.findAll({ where: { type: 'work-experience' }, order: [['position', 'asc']] }),
                portfolioTitles: await this.portfolioService.find({ where: { id: 1 } }),
                portfolioWorkTags: await this.portfolioService.getWorkTags(),
                portfolioWorks: await this.portfolioService.findAllPortFolio({ order: [['position', 'asc']]}),
                blogInfoTitle: await this.blogService.find({ where: { id: 1 } }),
                blogInfos: await this.blogService.findAll({ where: { type: 'blog' }, order: [['created_at', 'desc']] }),
                contactTitles: await this.contactService.find({ where: { id: 1 } })
            };

            return res.render('../frontend/layout/base-inner', this.viewData(data, this.module + 'view'));
        } catch (error) {
            req.flash('error_msg', error.message);
            return res.redirect('/system/home');
        }
    }
}

module.exports = HomeController;
