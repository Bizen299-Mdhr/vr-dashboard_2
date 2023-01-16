const Controller = require('@baseController');

class HomeController extends Controller {
    constructor(opts) {
        super(opts);
        this.service = opts.dashboardService;
        this.homeService = opts.homeService;
        this.title = 'Home';
        this.view = '../../frontend/home';
        this.url = '/home';
        this.module = 'home';
    }
  
    async index(req, res) {
        try { 
            this.innerPage = this.view + '/index';
            const data = {
                homeInfo:await this.homeService.find({where:{id:1}})
            };

            return res.render('../frontend/layout/base-inner', this.viewData(data, this.module+'view'));
        } catch (error) {
            req.flash('error_msg', error.message);
            return res.redirect('/system/home');
        }
    }
}

module.exports = HomeController;
