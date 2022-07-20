const Controller = require('@baseController');
class LoginLogController extends Controller {
    constructor(opts) {
        super(opts);
        this.service = opts.loginLogService;
        this.title = 'Login Logs';
        this.view = '../login-logs';
        this.url = '/login-logs';
        this.module = 'login-logs.login-logs.';
    }
}

module.exports = LoginLogController;