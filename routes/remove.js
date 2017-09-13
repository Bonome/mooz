"use strict";

var express = require('express');
var router = express.Router();
var controller = require('../controllers/remove');

router.post('/', controller.remove);

module.exports = router;
