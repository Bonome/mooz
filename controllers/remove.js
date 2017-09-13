"use strict";

var fs = require('fs-extra');
var path = require('path');
var utils = require('../controllers/utils');

var self = this;

exports.remove = function (req, res, next) {

	fs.remove(req.body.src)
	.then(() => {
  		res.json(true);
	})
	.catch(err => {
	  res.json(false);
	})
};
