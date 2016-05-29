"use strict";

var express = require('express');
var router = express.Router();
var controller = require('../controllers/scan_folders');

//router.get('/', auth.isLoggedIn, controller.scan);
router.get('/', controller.scan);

module.exports = router;