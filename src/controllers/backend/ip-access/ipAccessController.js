const Controller = require('@baseController');
const {logCrmEvents} = require("@lib/logHelper");
class IpAccessController extends Controller {
    constructor(opts) {
        super(opts);
        this.service = opts.ipAccessService;
        this.title = 'IP Access Control';
        this.view = '../ip-access';
        this.url = '/system/ip-access';
        this.module = 'ip-access.ip-access.';
    }
    async add(req, res) {
        try {
            await this.service.create(req.body, req.session.user);
            logCrmEvents(req, "Add " + this.title, "success", {message: this.title});
            req.flash('success_msg', this.title + ' updated successfully.');
            return res.redirect(this.url);
        } catch (error) {
            req.flash('error_msg', error.message);
            return res.redirect(this.url);
        }
    }
}

module.exports = IpAccessController;
