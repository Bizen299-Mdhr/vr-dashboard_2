const express = require('express');
const router = express.Router();
const { container } = require("@container");
const loginLogController = container.resolve('loginLogController');
const { checkPermission } = require('@middleware');
const wrapNext = require('@wrapNext');

router.get('/', checkPermission('login-logs.login-logs.view'), wrapNext(loginLogController.index));
module.exports = router;