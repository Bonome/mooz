"use strict";

var exec = require('child_process').exec;
var mv = require('mv');
var fs = require('fs');
var path = require('path');
var utils = require('../controllers/utils');
var dblite = require('dblite');
let db = dblite('./downloads.db');

var self = this;

exports.move = function (req, res, next) {
    var pile = [];
    var concurrentMax = 1;
    var conc = 0;

    var moov = function (filename) {
        mv(req.body.src + filename, req.body.dest + filename, {mkdirp: true}, function (err, response) {
            if (err) {
                console.log(err);
            }
            rmFromDB(req.body.src + filename);
//            console.log(response);
            
        });
    };

    var conmoov = function (filename) {
	    var filemp3 = filename.substring(0, filename.length - 5) + '.mp3';
        var conv = {
            'from': req.body.src + filename,
            'to': req.body.dest + filemp3,
        };
        pile.push(conv);
        convertPile();
    };

    var convertPile = function() {
        if(conc <= concurrentMax) {
            conc++;
            if(pile.length <= 0) {
                return;
            }
            var current = pile.splice(0, 1);
            console.log("./flac21mp3 \"" + current[0].from + "\" \"" + current[0].to + "\"");

            exec("./flac21mp3 \"" + current[0].from + "\" \"" + current[0].to + "\"", function (err, stdout, stderr) {
                if (err) {
                    console.log(err);
                }
                conc--;
                rmFromDB(current[0].from);
                convertPile();
           });
        }
    };

    var rmFromDB = function (file) {
      	db.query('delete from directories where path = ?', [file]);
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
