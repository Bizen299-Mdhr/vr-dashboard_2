
const express = require('express');
const router = express.Router();
const oauth = require("../../oauth2");
const { container } = require("@container");
const authController = container.resolve('apiAuthController');
const {validate} = require("@middleware");
const {tokenValidator} = require("@validators");
const passport = require('passport');

router.post('/login', [tokenValidator, validate], oauth.token);
router.post('/refresh-token', [tokenValidator, validate], oauth.token);
router.post('/logout',  [passport.authenticate('bearer', {session: false})], authController.logout);

module.exports = router;
