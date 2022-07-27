let config = {};
config.modules = {
    "home": "Dashboard",
    "user-management": "User Management",
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
    "email-templates": {"email-templates": "Email Template"},
    "configs": {
        "configs": "Configuration"
    },
    "login-logs": {
        "login-logs": "Login Logs"
    }
};
config.modulePermissions = {
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
    "languages": "fa fa-language",
    "email-templates": "fa fa-envelope",
    "master-data": "fa fa-object-group",
    "configs": "fa fa-cog",
    "login-logs": "fa fa-history"
};

module.exports = config;