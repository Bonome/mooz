"use strict";

var express = require('express');
var router = express.Router();
var controller = require('../controllers/downpath.js');

router.get('/', controller.list);

module.exports = router;
