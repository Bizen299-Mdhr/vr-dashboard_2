const express = require('express');
const router = express.Router();
const { container } = require("@container");
const configController = container.resolve('configController');
const { checkPermission } = require('@middleware');
const wrapNext = require('@wrapNext');

router.get('/', [checkPermission('configs.configs.view')], wrapNext(configController.index));
router.post('/', [checkPermission('configs.configs.create')], wrapNext(configController.add));
router.put('/:id', [checkPermission('configs.configs.edit')], wrapNext(configController.edit));
router.delete('/:id', checkPermission('configs.configs.delete'), wrapNext(configController.delete));

module.exports = router;