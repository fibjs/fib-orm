import net = require('net');
import FxDbDriver = require('@fxjs/db-driver');

import getEventEmitter = require('./base');

import * as Utilities from '../../Utilities';

const Driver: typeof FxDbDriverNS.Driver = FxDbDriver.getDriver('mysql')

export class Database extends Driver implements FxOrmDb.DatabaseBase<Class_MySQL> {
    eventor: Class_EventEmitter = getEventEmitter();
    conn: Class_MySQL;

    connect(cb?: FxOrmNS.GenericCallback<Class_MySQL>) {
        const exposedErrResults = Utilities.exposeErrAndResultFromSyncMethod(
            () => this.conn = super.open()
        )
        Utilities.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: !!cb, callback: cb});
        
        return this.conn
    }

    query<T = any>(sql: string, cb?: FxOrmNS.GenericCallback<T>) {
        const exposedErrResults = Utilities.exposeErrAndResultFromSyncMethod(
            () => this.execute(sql)
        )

        Utilities.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: !!cb, callback: cb});
            
        return exposedErrResults.result;
    }
}
