const express = require('express');
const router = express.Router();
const { container } = require("@container");
const apiUserController = container.resolve('apiUserController');
const {validate} = require("@middleware");
const {userValidator} = require("@validators");

const wrapNext = require('@wrapNext');

router.post('/', [userValidator, validate], wrapNext(apiUserController.register));
router.get('/', wrapNext(apiUserController.getAllUsers));
router.get('/:id', wrapNext(apiUserController.getUserbyId));
router.put('/:id', [userValidator, validate], wrapNext(apiUserController.updateUser));
router.delete('/:id', wrapNext(apiUserController.deleteUser));

module.exports = router;