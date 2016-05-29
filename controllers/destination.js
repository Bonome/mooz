var config = require(__dirname + '/../config/config.json');


exports.list = function (req, res) {
        res.json(config.musicPath);
};
