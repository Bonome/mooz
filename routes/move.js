"use strict";

var express = require('express');
var router = express.Router();
var controller = require('../controllers/move');

router.post('/', controller.move);

module.exports = router;