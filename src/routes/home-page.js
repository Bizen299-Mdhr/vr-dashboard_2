const express = require('express');
const router = express.Router();
const { container } = require("@container");
const homePageController = container.resolve('homePageController');
const { checkPermission } = require('@middleware');
const wrapNext = require('@wrapNext');

router.get('/', [checkPermission('frontend-management.home-page.view')], wrapNext(homePageController.index));
router.post('/', [checkPermission('frontend-management.home-page.create')], wrapNext(homePageController.add));
router.put('/', [checkPermission('frontend-management.home-page.edit')], wrapNext(homePageController.edit));

module.exports = router;