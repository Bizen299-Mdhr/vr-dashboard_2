const express = require('express');
const router = express.Router();
const { container } = require("@container");
const resumeController = container.resolve('resumeController');
const { checkPermission } = require('@middleware');
const wrapNext = require('@wrapNext');

router.get('/', [checkPermission('frontend-management.resume.view')], wrapNext(resumeController.index));
router.post('/', [checkPermission('frontend-management.resume.create')], wrapNext(resumeController.add));
router.put('/', [checkPermission('frontend-management.resume.edit')], wrapNext(resumeController.edit));

module.exports = router;