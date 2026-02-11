import db = require('db')

import { FxDbDriverNS } from '../Typo';
import { FxOrmCoreCallbackNS } from '../../orm-core/index';
import { SQLDriver } from "./base.class";
import { logDebugSQL } from '../utils';

function escapeSchemaName(schema: string) {
    return `"${schema.replace(/"/g, '""')}"`;
}

export default class DMDriver extends SQLDriver<Class_DbConnection> implements FxDbDriverNS.SQLDriver {
    constructor (conn: FxDbDriverNS.ConnectionInputArgs | string) {
        super(conn);

        this.connection = null
    }

    switchDb (targetDb: string) {
        this.execute(`SET SCHEMA ${escapeSchemaName(targetDb)}`);
        this.currentDb = targetDb;
    }

    open (): Class_DbConnection { return super.open() }
    close (): void {
        if (this.connection) this.connection.close()
    }
    ping (): void { return }
    begin (): void { return this.connection.begin() }
    commit (): void { return this.connection.commit() }
    trans<T = any> (cb: FxOrmCoreCallbackNS.ExecutionCallback<T>): boolean { return this.connection.trans(cb); }
    rollback (): void { return this.connection.rollback() }

    getConnection (): Class_DbConnection { return (db as any).openDM(this.uri) }

    dbExists (dbname: string): boolean {
        const schema = dbname.toUpperCase();
        return this.execute(
            `SELECT OBJECT_NAME FROM ALL_OBJECTS WHERE OBJECT_TYPE='SCH' AND OBJECT_NAME='${schema}'`
        ).length > 0;
    }

    execute<T = any> (sql: string): T {
        if (this.extend_config.debug_sql) {
            logDebugSQL('dm', sql);
        }

        if (!this.connection) this.open()
        try {
            return this.connection.execute(sql) as any;
        } catch (e) {
            const err = e as any;
            if (err && typeof err.message === 'string' && !err.message.includes('SQL:')) {
                err.message += `\nSQL: ${sql}`;
            }
            if (err && !err.sql) {
                err.sql = sql;
            }
            throw err;
        }
    }
}
