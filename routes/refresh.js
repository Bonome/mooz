"use strict";

var express = require('express');
var router = express.Router();
var controller = require('../controllers/scan_dir');

router.post('/', controller.refresh);

module.exports = router;
