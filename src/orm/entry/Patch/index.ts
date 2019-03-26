import url = require('url')
import util = require('util')

import { patchSync, patchDriver, execQuerySync } from './utils';
import patchPlugin from './plugin'

export = function (connection: FxOrmNS.IConnectFunction) {
    const conn = util.sync(connection) 

    const connectSync = function (opts: FxOrmNS.FibORMIConnectionOptions) {
        if (typeof opts == 'string')
            opts = url.parse(opts, true).toJSON();
        else if (typeof opts == 'object')
            opts = util.clone(opts);

        if (opts.protocol === 'sqlite:' && opts.timezone === undefined)
            opts.timezone = 'UTC';

        var orm: FxOrmNS.FibOrmDB = conn.call(this, opts);

        patchSync(orm, [
            'sync',
            'close',
            'drop',
            'ping'
        ]);

        patchDriver(orm.driver);

        orm.use(patchPlugin);

        orm.begin = function () {
            return this.driver.db.conn.begin();
        };

        orm.commit = function () {
            return this.driver.db.conn.commit();
        };

        orm.rollback = function () {
            return this.driver.db.conn.rollback();
        };

        orm.trans = function (func) {
            return this.driver.db.conn.trans(func);
        };

        orm.driver.execQuerySync = execQuerySync;

        return orm;
    }

    return connectSync
}
