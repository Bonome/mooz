"use strict";

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
            console.log(response);
            
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
                        if (file.lastIndexOf('.flac') === file.length - 5 || file.lastIndexOf('.FLAC') === file.length - 5) {
                            console.log('flac');
                            f2m.convert(
                                    file,
                                    function (data) {
//                                        console.log(data.err.toString());
                                        if (data.err.toString().indexOf('audio') >= 0) {
                                            var posLastSlash = req.body.src.length;
                                            var posDot = file.length - 5;
                                            var filename = file.substring(posLastSlash, posDot) + '.mp3';
                                            console.log(filename);
                                            moov(filename);
                                        }
                                    }
                            )
                        } else {
                            var posLastSlash = req.body.src.length;
                            var filename = file.substring(posLastSlash);
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
