const express = require('express');
const router = express.Router();
const { container } = require("@container");
const aboutPageController = container.resolve('aboutPageController');
const { checkPermission } = require('@middleware');
const wrapNext = require('@wrapNext');

router.get('/', [checkPermission('frontend-management.about-page.view')], wrapNext(aboutPageController.index));
router.post('/', [checkPermission('frontend-management.about-page.create')], wrapNext(aboutPageController.add));
router.put('/', [checkPermission('frontend-management.about-page.edit')], wrapNext(aboutPageController.edit));

module.exports = router;