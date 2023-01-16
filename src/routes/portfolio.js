const express = require('express');
const router = express.Router();
const { container } = require("@container");
const portfolioController = container.resolve('portfolioController');
const { checkPermission } = require('@middleware');
const wrapNext = require('@wrapNext');

router.get('/', [checkPermission('frontend-management.portfolio.view')], wrapNext(portfolioController.index));
router.post('/', [checkPermission('frontend-management.portfolio.create')], wrapNext(portfolioController.add));
router.put('/', [checkPermission('frontend-management.portfolio.edit')], wrapNext(portfolioController.edit));

module.exports = router;