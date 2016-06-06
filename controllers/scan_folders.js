"use strict";

var config = require(__dirname + '/../config/config.json');
var fs = require('fs');
var path = require('path');
var utils = require('../controllers/utils');

//var process = require('./process_files');

exports.scan = function (req, res) {
  var dirPath = config.downPath;
console.log(dirPath);
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
//            process.parseFile(file);
            if (!--pending) {
            results.push(utils.getPathRef(file));
              done(null, results);
            }
          }
        });
      });
    });
  };
  walk(dirPath, function (err, results) {
    if (err) {
      throw err;
    }
    res.json(results);
  });
};