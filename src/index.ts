import vm = require('vm')
const patch = require('./patch');

const sbox = new vm.SandBox({
    util: require('util'),
    events: require('events'),
    url: require('url'),
    sqlite3: require('./modules/sqlite3'),
    mysql: require('./modules/mysql'),

    enforce: require('@fibjs/enforce')
});

const orm = sbox.require('./orm/src/ORM', __dirname);

export = patch(orm);
