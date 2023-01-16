const express = require('express');
const router = express.Router();
const { container } = require("@container");
const contactInfoController = container.resolve('contactInfoController');
const { checkPermission } = require('@middleware');
const wrapNext = require('@wrapNext');

router.get('/', [checkPermission('frontend-management.contact-info.view')], wrapNext(contactInfoController.index));
router.post('/', [checkPermission('frontend-management.contact-info.create')], wrapNext(contactInfoController.add));
router.put('/', [checkPermission('frontend-management.contact-info.edit')], wrapNext(contactInfoController.edit));

module.exports = router;