"use strict";

var config = require(__dirname + '/../config/config.json');
var fs = require('fs');
var path = require('path');
var dblite = require('dblite');

let db = dblite('./downloads.db');

var utils = require('../controllers/utils');
//var process = require('./process_files');

exports.scan = function (req, res) {
  var dirPath = config.downPath;

  var insertOnlyNew = function (file) {
//    var insert = 'INSERT INTO directories(path) SELECT "'+file+'" WHERE NOT EXISTS(SELECT 1 FROM directories where path = "'+file+'");'; 
    console.log('path : ' + file);
    db.query('SELECT id FROM directories where path = "'+file+'"',function(err, row) {
      console.log(row);
      if(row == null || row.length === 0) {
        console.log('insert..');
        db.query('INSERT INTO directories VALUES (null, ?)', [file], function(err, row) {
          console.log('inserted :'+err+'  ' + row);
        });
      }
    });
  };

  var insert = function(file) {
    console.log(file);
    db.query('INSERT INTO directories VALUES (null, ?)', [file], function(err, row) {
      console.log('inserted :'+err+'  ' + row);
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
//	console.log('scan: ' + file);
        file = path.resolve(dir, file);
        fs.stat(file, function (err, stat) {
          if (stat && stat.isDirectory()) {
            walk(file, function (err, res) {
              results = results.concat(res);
              if (!--pending) {
//                insertOnlyNew(utils.getPathRef(file));
	            insert(utils.getPathRef(file));
		        results.push(utils.getPathRef(file));
                done(null, results);
              }
            });
          } else {
//            process.parseFile(file);
            if (!--pending) {
//	           insertOnlyNew(utils.getPathRef(file));
    	      insert(utils.getPathRef(file));
              results.push(utils.getPathRef(file));
              done(null, results);
            }
          }
        });
      });
    });
  };

  db.query('DELETE FROM directories;');

  walk(dirPath, function (err, results) {
    if (err) {
      throw err;
    }


    res.json(results);
//    db.close();
  });
};
