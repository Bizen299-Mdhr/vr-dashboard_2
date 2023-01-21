const express = require('express');
const router = express.Router();
const { container } = require("@container");
const portfolioController = container.resolve('portfolioController');
const { checkPermission } = require('@middleware');
const wrapNext = require('@wrapNext');

router.get('/', [checkPermission('frontend-management.portfolio.view')], wrapNext(portfolioController.index));
router.get('/create', [checkPermission('frontend-management.portfolio.view')], wrapNext(portfolioController.addView));
router.post('/', [checkPermission('frontend-management.portfolio.create')], wrapNext(portfolioController.add));
router.put('/:id', [checkPermission('frontend-management.portfolio.edit')], wrapNext(portfolioController.edit));
router.post('/update_positions', wrapNext(portfolioController.updatePosition));
router.get('/:id', [checkPermission('frontend-management.portfolio.edit')], wrapNext(portfolioController.editView));
router.delete('/:id', checkPermission('frontend-management.portfolio.delete'), wrapNext(portfolioController.delete));
module.exports = router;