"use strict";

var config = require(__dirname + '/../config/config.json');
var fs = require('fs');
var path = require('path');
var dblite = require('dblite');

let db = dblite('./downloads.db');

var utils = require('../controllers/utils');
//var process = require('./process_files');

exports.refresh = function (req, res) {
    var dirPath = config.downPath;
    var dir = req.body.src;

    var insertOnlyNew = function (file) {
        //    var insert = 'INSERT INTO directories(path) SELECT "'+file+'" WHERE NOT EXISTS(SELECT 1 FROM directories where path = "'+file+'");'; 
        console.log('path : ' + file);
        db.query('SELECT id FROM directories where path = "'+file+'"',function(err, row) {
            if(err != null){
                console.log('select res ERR: '+err);
            }
            console.log('select result: ' +row);
            if(row == null || row.length === 0) {
                console.log('insert..');
                db.query('INSERT INTO directories VALUES (null, ?)', [file], function(err, row) {
                    console.log('inserted :'+err+'  ' + row);
                });
            }else{
                console.log('already in db!');
            }
        });
    };

    var insert = function(file) {
        console.log(file);
        db.query('INSERT INTO directories VALUES (null, ?)', [file], function(err, row) {
            console.log('inserted :'+err+'  ' + row);
        });
    };

    var list_dir = function (dir, done) {
        console.log('dirs: '+ dir);
        var results = [];
        fs.readdir(dir, function (err, list) {
            if (err){
                console.log('ERR1: '+err);
                return done(err);
            }
          console.log('list: '+list);
          var pending = list.length;
          if (!pending){
              return done(null, results);
          }
          list.forEach(function (file) {
              file = path.join(dir, file);
              console.log('file : ' + file);
              insertOnlyNew(file);
              //    	 insert(utils.getPathRef(file));
              results.push(utils.getPathRef(file));
          });
          done(null, results);
      });
  };

  if(dir != null) {
      dirPath = dir;
  }
  dirPath = path.normalize(dirPath);
  console.log('dir to list'+dirPath);

  list_dir(dirPath, function (err, results) {
    if (err) {
        console.log(err);
        throw err;
    }
    console.log(results);

    res.json(results);
    //    db.close();
  });
};
