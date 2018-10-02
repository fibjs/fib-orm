/// <reference path="index.d.ts" />
/// <reference path="../../@types/index.d.ts" />

import db = require('db');
import OrmNS from '@fxjs/orm';

class Database implements DatabaseBase {
    conn: OrmNS.ConnInstanceInOrmConnDriverDB;
    opts: OrmNS.OrmConnectionOpts;
    
    constructor(connOpts) {
        this.opts = connOpts;
    }

    on(ev) {}

    ping(cb: Function) {
        setImmediate(cb);
    }

    connect(cb: Function): void {
        const that = this;
        const openMySQL: Function = db.openMySQL

        openMySQL(this.opts, function (e: Error, conn: OrmNS.ConnInstanceInOrmConnDriverDB) {
            if (!e)
                that.conn = conn;
            cb(e);
        });
    }

    query(sql: string, cb: Function) {
        this.conn.execute(sql, cb);
    }

    execute(sql: string) {
        return this.conn.execute(sql);
    }

    end(cb: Function) {
        (this.conn as any).close(cb);
    }
}

export const createConnection = function (connOpts: OrmNS.OrmConnectionOpts) {
    return new Database(connOpts);
};
