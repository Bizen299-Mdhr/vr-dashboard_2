const express = require('express');
const router = express.Router();
const { container } = require("@container");
const languageController = container.resolve('languageController');
const { checkPermission } = require('@middleware');
const wrapNext = require('@wrapNext');

router.get('/', [checkPermission('languages.languages.view')], wrapNext(languageController.index));
router.get('/download', checkPermission('languages.languages.export'), wrapNext(languageController.downloadSample));
router.post('/upload', checkPermission('languages.languages.upload'), wrapNext(languageController.upload));
router.post('/:id/edit', checkPermission('languages.languages.upload'), wrapNext(languageController.edit));
router.post('/update', checkPermission('languages.languages.upload'), wrapNext(languageController.updateLanguage));
router.get('/changeLanguage', wrapNext(languageController.changeLanguage));
router.delete('/:id', checkPermission('languages.languages.delete'), wrapNext(languageController.delete));
router.get('/ajax-trans', wrapNext(languageController.ajaxTrans));
module.exports = router;