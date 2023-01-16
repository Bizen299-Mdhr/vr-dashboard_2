const express = require('express');
const router = express.Router();
const { container } = require("@container");
const blogController = container.resolve('blogController');
const { checkPermission } = require('@middleware');
const wrapNext = require('@wrapNext');

router.get('/', [checkPermission('frontend-management.blog.view')], wrapNext(blogController.index));
router.get('/create', [checkPermission('frontend-management.blog.view')], wrapNext(blogController.addView));
router.post('/', [checkPermission('frontend-management.blog.create')], wrapNext(blogController.add));
router.put('/:id', [checkPermission('frontend-management.blog.edit')], wrapNext(blogController.edit));
router.get('/:id', [checkPermission('frontend-management.blog.edit')], wrapNext(blogController.editView));
router.delete('/:id', checkPermission('frontend-management.blog.delete'), wrapNext(blogController.delete));
module.exports = router;