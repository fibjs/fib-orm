import FxDbDriver = require('@fxjs/db-driver');

import getEventEmitter = require('./base');

import * as Utilities from '../../Utilities';

function isMemoryMode (href: string) {
    return href === ':memory:'
}
const Driver: typeof FxDbDriverNS.Driver = FxDbDriver.getDriver('sqlite')

export class Database extends Driver implements FxOrmDb.DatabaseBase_SQLite {
    eventor: Class_EventEmitter = getEventEmitter();
    conn: Class_SQLite;
    get use_memory () {
        return isMemoryMode(this.config.href)
    }

    constructor (opts: any) {
        super(opts)

        this.config.slashes = false
    }

    connect(cb?: FxOrmNS.GenericCallback<Class_SQLite>) {
        const exposedErrResults = Utilities.exposeErrAndResultFromSyncMethod(
            () => this.conn = super.open()
        )
        Utilities.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: !!cb, callback: cb});
        
        return this.conn
    }

    query<T = any>(sql: string, cb?: FxOrmNS.GenericCallback<T>) {
        const exposedErrResults = Utilities.exposeErrAndResultFromSyncMethod(
            () => this.execute(sql)
        );
        Utilities.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: !!cb, callback: cb});
            
        return exposedErrResults.result
    }

    all<T = any>(sql: string, cb?: FxOrmNS.GenericCallback<T>) {
        return this.query(sql, cb);
    }

    get<T = any>(sql: string, cb?: FxOrmNS.GenericCallback<T>) {
        const results = this.all(sql)[0];

        if (typeof cb === 'function')
            return cb(null, results);

        return results;
    }
}
