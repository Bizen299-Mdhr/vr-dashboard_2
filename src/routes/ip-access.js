const express = require('express');
const router = express.Router();
const { container } = require("@container");
const ipAccessController = container.resolve('ipAccessController');
const { checkPermission, validate } = require('@middleware');
const { ipAccessValidator } = require('@validators');
const wrapNext = require('@wrapNext');

router.get('/', [checkPermission('ip-access.ip-access.view')], wrapNext(ipAccessController.index));
router.post('/', [checkPermission('ip-access.ip-access.create'), ipAccessValidator, validate], wrapNext(ipAccessController.add));
module.exports = router;