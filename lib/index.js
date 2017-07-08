var vm = require('vm');
var patch = require('./patch');

var sbox = new vm.SandBox({
    util: require('util'),
    events: require('events'),
    url: require('./modules/url'),
    sqlite3: require('./modules/sqlite3'),
    mysql: require('./modules/mysql')
});

var orm = sbox.require('orm', __filename);

module.exports = patch(orm);