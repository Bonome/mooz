var config = require(__dirname + '/../config/config.json');
var dblite = require('dblite');
let db = dblite('./downloads.db');

exports.dirs = function (req, res) {
    db.query('SELECT * from  directories', (err, rows) => {
        if (err) {
           console.log(err);
        }
        res.json(rows);
    });
};
