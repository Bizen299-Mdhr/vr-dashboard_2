let config = {};
config.modules = {
    "home": "Dashboard",
    "user-management": "User Management",
    "frontend-management": "frontend Management",
    "email-templates": "Email Template",
    "configs": "Configuration",
    "login-logs": "Login Logs"
};

config.modulePages = {
    "home": {
        "home": "Dashboard"
    },
    "user-management": {
        "admin-roles": "Roles",
        'admins': "Admins"
    },
    "email-templates": { "email-templates": "Email Template" },
    "configs": {
        "configs": "Configuration"
    },
    "login-logs": {
        "login-logs": "Login Logs"
    },
    "frontend-management": {
        "home-page": "Home Page",
        "about-page": "About Page",
        "resume": "Resume",
        "portfolio": "Portfolio",
        "blog": "blog",
        "contact-info": "Contact Information"
    }
};
config.modulePermissions = {
    "frontend-management": {
        "frontend-management.home-page.view": "View Home Page",
        "frontend-management.home-page.edit": "Edit Home Page",

        "frontend-management.about-page.view": "View About Page",
        "frontend-management.about-page.edit": "Edit About Page",

        "frontend-management.resume.view": "View Resume",
        "frontend-management.resume.edit": "Edit Resume",
        "frontend-management.resume.delete": "Delete Resume",

        "frontend-management.portfolio.view": "View Portfolio",
        "frontend-management.portfolio.edit": "Edit Portfolio",
        "frontend-management.portfolio.delete": "Delete Portfolio",

        "frontend-management.blog.view": "View Blog",
        "frontend-management.blog.create": "Create Blog",
        "frontend-management.blog.edit": "Edit Blog",
        "frontend-management.blog.delete": "Delete Blog",

        "frontend-management.contact-info.view": "View Contact Info",
        "frontend-management.contact-info.create": "Create Contact Info",
        "frontend-management.contact-info.edit": "Edit Contact Info",
        "frontend-management.contact-info.delete": "Delete Contact Info"
    },


    "user-management": {
        "user-management.admin-roles.view": "View Admin Roles",
        "user-management.admin-roles.create": "Create Admin Roles",
        "user-management.admin-roles.edit": "Edit Admin Roles",
        "user-management.admin-roles.delete": "Delete Admin Roles",
        "user-management.admin-roles.add-users": "Assign Admins",

        "user-management.admins.view": "View Admins",
        "user-management.admins.create": "Create Admin",
        "user-management.admins.edit": "Edit Admin",
        "user-management.admins.delete": "Delete Admin",
        "user-management.admins.password": "Change Admin Password"
    },
    "email-templates": {
        "email-templates.email-templates.view": "View Email Template",
        // "email-templates.email-templates.create": "Create Email Template",
        "email-templates.email-templates.edit": "Edit Email Template",
        "email-templates.email-templates.delete": "Delete Email Template"
    },
    "configs": {
        "configs.configs.view": "View Configs",
        "configs.configs.edit": "Edit Config"
    },
    "login-logs": {
        "login-logs.login-logs.view": "View Login Logs"
    }
};
config.moduleIcons = {
    "home": "fa fa-tachometer",
    "admin-roles": "fa fa-universal-access",
    "user-management": "fa fa-users",
    "frontend-management": "fa fa-book",
    "languages": "fa fa-language",
    "email-templates": "fa fa-envelope",
    "master-data": "fa fa-object-group",
    "configs": "fa fa-cog",
    "login-logs": "fa fa-history"

};

module.exports = config;