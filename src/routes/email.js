const express = require('express');
const router = express.Router();
const { container } = require("@container");
const emailTemplateController = container.resolve('emailTemplateController');
const { checkPermission, validate } = require('@middleware');
const { EmailValidation } = require('@validators');
const wrapNext = require('@wrapNext');

router.get('/', [checkPermission('email-templates.email-templates.view')], wrapNext(emailTemplateController.index));
router.get('/:id', [checkPermission('email-templates.email-templates.edit')], wrapNext(emailTemplateController.editView));
router.put('/:id', [checkPermission('email-templates.email-templates.view'),EmailValidation, validate], wrapNext(emailTemplateController.edit));
router.delete('/:id', checkPermission('email-templates.email-templates.view'), wrapNext(emailTemplateController.delete));

module.exports = router;