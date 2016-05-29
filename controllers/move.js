"use strict";

var mkdirp = require('mkdirp');
var mv = require('mv');
var fs = require('fs');
var path = require('path');
var q = require("q");

var self = this;

exports.move = function (req, res, next) {
    var destPath = [];

//    mkdirp(req.body.dest, function (err, dir) {
//        if (err) {
//            throw err;
//        }
//        if(dir == null) {
//            dir = req.body.dest + '/';
//        }
//        console.log(dir);
        mv(req.body.src, req.body.dest, {mkdirp: true}, function (err) {
            if (err) {
                throw err;
            }
            res.json(true);
        });
//    });
};
