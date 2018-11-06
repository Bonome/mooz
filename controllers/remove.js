"use strict";

var fs = require('fs-extra');
var path = require('path');
var utils = require('../controllers/utils');
var dblite = require('dblite');
let db = dblite('./downloads.db');

var self = this;

exports.remove = function (req, res, next) {

	fs.remove(req.body.src)
	.then(() => {
		db.query('delete from directories where path = ?', [req.body.src]);
  		res.json(true);
	})
	.catch(err => {
	  res.json(false);
	})
};
