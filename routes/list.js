"use strict";

var express = require('express');
var router = express.Router();
var controller = require('../controllers/list.js');

router.get('/', controller.dirs);

module.exports = router;
