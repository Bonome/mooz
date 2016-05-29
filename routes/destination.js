"use strict";

var express = require('express');
var router = express.Router();
var controller = require('../controllers/destination');

router.get('/', controller.list);

module.exports = router;