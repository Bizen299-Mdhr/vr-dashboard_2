const express = require('express');
const router = express.Router();
const { container } = require("@container");
const adminController = container.resolve('adminController');
const { checkPermission, validate } = require('@middleware');
const { addAdminValidation, changePasswordValidation } = require('@validators');
const wrapNext = require('@wrapNext');

router.get('/', [checkPermission('user-management.admins.view')], wrapNext(adminController.index));
router.get('/create', [checkPermission('user-management.admins.create')], wrapNext(adminController.addView));
router.post('/', [checkPermission('user-management.admins.create'), addAdminValidation, validate], wrapNext(adminController.add));
router.get('/:id', [checkPermission('user-management.admins.view')], wrapNext(adminController.editView));
router.put('/:id', [checkPermission('user-management.admins.edit'), addAdminValidation, validate], wrapNext(adminController.edit));
router.delete('/:id', checkPermission('user-management.admins.delete'), wrapNext(adminController.delete));
router.get('/:id/change-password', [checkPermission('user-management.admins.password')], wrapNext(adminController.changePasswordView));
router.put('/:id/change-password', [checkPermission('user-management.admins.password'), changePasswordValidation, validate], wrapNext(adminController.changePassword));
router.get('/get/departments',[checkPermission('user-management.admins.view')], wrapNext(adminController.getDepartments ));

module.exports = router;