
const express = require('express');
const router = express.Router();
const auth = require('./auth');
const apiuser = require('./apiUser');
const passport = require('passport');

router.use('/auth', auth);
router.use('/users', [passport.authenticate('bearer', {session: false})], apiuser);

module.exports = router;