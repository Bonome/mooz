"use strict";

var exec = require('child_process').exec;
var mv = require('mv');
var f2m = require("flac-to-mp3")
var fs = require('fs');
var path = require('path');
var utils = require('../controllers/utils');

var self = this;

exports.move = function (req, res, next) {

    var moov = function (filename) {
        mv(req.body.src + filename, req.body.dest + filename, {mkdirp: true}, function (err, response) {
            if (err) {
                console.log(err);
            }
//            console.log(response);
            
        });
    };
    var conmoov = function (filename) {
	var filemp3 = filename.substring(0, filename.length - 5) + '.mp3';
console.log("./flac21mp3 \"" + req.body.src + filename + "\" \"" + req.body.dest + filemp3 + "\"");
        exec("./flac21mp3 \"" + req.body.src + filename + "\" \"" + req.body.dest + filemp3 + "\"", function (err, stdout, stderr) {
            if (err) {
                console.log(err);
            }
//            console.log(response);

        });
    };

    var walk = function (dir, done) {
        var results = [];
        fs.readdir(dir, function (err, list) {
            if (err)
                return done(err);
            var pending = list.length;
            if (!pending)
                return done(null, results);
            list.forEach(function (file) {
                file = path.resolve(dir, file);
                fs.stat(file, function (err, stat) {
                    if (stat && stat.isDirectory()) {
                        walk(file, function (err, res) {
                            results = results.concat(res);
                            if (!--pending) {
                                done(null, results);
                            }
                        });
                    } else {
			var posLastSlash = req.body.src.length;
			var filename = file.substring(posLastSlash);
                        //if (file.lastIndexOf('.flac') === file.length - 5 || file.lastIndexOf('.FLAC') === file.length - 5) {
                        if (file.substring(file.length - 5) === '.flac') {
                            conmoov(filename);
                        } else {
                            moov(filename);
                        }
                        if (!--pending) {
                            results.push(utils.getPathRef(file));
                            done(null, results);
                        }
                    }
                });
            });
        });
    };
    walk(req.body.src, function (err, results) {
        if (err) {
            throw err;
        }

        res.json(true);
    });

};
