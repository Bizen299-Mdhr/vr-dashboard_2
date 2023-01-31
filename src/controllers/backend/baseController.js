const {logCrmEvents} = require("@lib/logHelper");
const {base64encode, base64decode} = require("@lib");
const MultipleDeleteError = require("../../errors/multipleDeleteError");
class BaseController {
    constructor({bindAll, container}) {
        this.container = container;
        bindAll(this, BaseController.prototype);
        this.breadCrums = {};
    }

    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
    }

    get innerPage() {
        return this._innerPage;
    }

    set innerPage(value) {
        this._innerPage = value;
    }

    async index(req, res) {
        try {
            this.innerPage = this.view + '/index';
            let data = await this.service.indexPageData(req);
            data.breadcrumbs = this.indexBreadCrumb();
            logCrmEvents(req, "Page Visit", "success", {message: this.title});
            req.session.cancelUrl = req.originalUrl;
            return res.render('layout/base-inner', this.viewData(data, this.module+'view'));
        } catch (error) {
            req.flash('error_msg', error.message);
            return res.redirect('/system/home');
        }
    }

    async addView(req, res) {
        try {
            this.innerPage = this.view + '/add';
            const data = await this.service.createPageData(req)??{};
            typeof data?.breadcrumbs == "undefined" ? data.breadcrumbs = this.formBreadCrumb("Create") : data?.breadcrumbs ?? null;
            logCrmEvents(req, "Page Visit", "success", {message: this.title});
            return res.render('layout/base-inner', this.viewData(data, this.module + 'create', 'Add ' + this.title));
        } catch (error) {
            req.flash('error_msg', error.message);
            return res.redirect('back');
        }
    }

    async add(req, res) {
        try {
            await this.service.create(req.body, req.session.user);
            logCrmEvents(req, "Add " + this.title, "success", {message: this.title});
            req.flash('success_msg', this.title + ' added successfully.');
            return res.redirect(this.url);
        } catch (error) {
            req.flash('inputData', req.body);
            req.flash('error_msg', error.message);
            return res.redirect('back');
        }
    }

    async editView(req, res) {
        try {
            this.innerPage = this.view + '/edit';
            const data = await this.service.editPageData(req.params.id);
            const version = JSON.parse(JSON.stringify(data)).data.version;
            if (version) {
                data.verNum = base64encode(version.toString());
            }
            data.breadcrumbs = this.formBreadCrumb("Edit", req?.session?.cancelUrl);
            logCrmEvents(req, "Page Visit", "success", {message: 'Edit' + this.title});
            return res.render('layout/base-inner', this.viewData(data, this.module + 'edit', 'Edit ' + this.title));
        } catch (error) {
            req.flash('error_msg', error.message);
            return res.redirect(this.url);
        }
    }

    async edit(req, res) {
        try {
            if (req.body.verNum && req.body.verNum !== "") {
                const decodedVer = parseInt(base64decode(req.body.verNum));
                const data = await this.service.findOne({where: {_id: req.params.id}});
                if (data.version !== decodedVer) {
                    logCrmEvents(req, "Event", "error", {error: 'optimistic lock error'});
                    req.flash('error_msg', "Optimistic lock error.");
                    return res.redirect('back');
                }
            }
            const updatedData = await this.service.findAndUpdate(req.params.id, req.body, req.session.user);
            const _id = updatedData?.[1]?.[0]._id;
            logCrmEvents(req, "Event", "success", {message: this.title + " updated"});
            req.flash('success_msg', this.title + ' updated successfully');
            return res.redirect(_id ? this.url+`/${_id}`:this.url);
        } catch (error) {
            req.flash('inputData', req.body);
            req.flash('error_msg', error.message);
            return res.redirect(this.url);
        }
    }

    async delete(req, res) {
        try {
            await this.service.delete(req.params.id);
            logCrmEvents(req, "Delete " + this.title, "success", {message: this.title + " Delete"});
            req.flash('success_msg', this.title + ' deleted successfully');
            return res.redirect('back');
        } catch (error) {
            req.flash('error_msg', error.message);
            return res.redirect('back');
        }
    }

    async deleteMultiple(req, res) {
        try {
            await this.service.deleteMultiple(req.body.data_ids);
            logCrmEvents(req, "Delete " + this.title, "success", {message: this.title + " Delete"});
            req.flash('success_msg', this.title + ' deleted successfully');
            return res.redirect('back');
        } catch (error) {
            if(error instanceof MultipleDeleteError){
                const splittedText = error.message.split('||');
                const transMsg = splittedText[1].trim();
                req.flash('un_trans_error', `${splittedText[0]}${transMsg}`);
            }else{
                req.flash('error_msg', error.message);
            }
            return res.redirect(this.url);
        }
    }

    viewData(data, module, title, originalUrl = null) {
        return {
            ...data,
            pageTitle: title ?? this.title,
            innerPage: this.innerPage,
            module: module,
            url: originalUrl !== null ? originalUrl : this.url
        };
    }

    indexBreadCrumb(originalUrl = undefined, mergedWithFormBreadcrumb = false) {
        let url = this.url;
        if(originalUrl){
            url = originalUrl;
        }
        return [
            // {...this.dashboardBreadCrumb()}, 
            {title: this.title, link: mergedWithFormBreadcrumb ? url : '#'}
        ];
    }

    formBreadCrumb(title, cancelUrl = undefined) {
        return [
            ...this.indexBreadCrumb(cancelUrl, true),
            {title: title}
        ];
    }

    dashboardBreadCrumb() {
        return {
            title: "Dashboard",
            link: "/system/home"
        };
    }

    customBreadCrumb(customs) {
        return [
            // { ...this.dashboardBreadCrumb()}
        ].concat(customs);
    }
}
module.exports = BaseController;
