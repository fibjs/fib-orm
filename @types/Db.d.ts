/// <reference types="fib-pool" />

declare namespace FxOrmDb {
    interface DatabaseBaseConfig extends /* FxDbDriverNS.DBConnectionConfig,  */Class_UrlObject {
        pool: FxDbDriverNS.ConnectionPoolOptions
    }

    interface DatabaseBase<ConnType = any> extends FxDbDriverNS.Driver<ConnType> {
        eventor: Class_EventEmitter
        // conn: FxDbDriverNS.Driver;
        conn: ConnType;
        // readonly uri: string;

        // ping: {
        //     (cb?: FxOrmNS.VoidCallback): void
        // }
        // execute: {
        //     (sql: string, ...args: any[]): any[];
        // }
        query: {
            <T=any>(query: string, cb?: FxOrmNS.GenericCallback<T>): T
        }
        
        connect: {
            (cb?: FxOrmNS.GenericCallback<ConnType>): void
            (): ConnType
        }
        // pool: FibPoolNS.FibPoolFunction<DatabaseBase['conn']>
    }

    interface DatabaseBase_SQLite extends DatabaseBase<Class_SQLite> {
        readonly use_memory: boolean
        
        all: DatabaseBase_SQLite['query']
        get: DatabaseBase_SQLite['query']
    }

    // interface DatabaseBase_MySQL extends DatabaseBase<Class_MySQL> {}

    // not supported now.
    interface DatabaseBase_PostgreSQL extends DatabaseBase {
    }

    // common
    type AGGREGATION_METHOD_COMMON =
        "ABS"
        | "ROUND"
        | "AVG"
        | "MIN"
        | "MAX"
        | "SUM"
        | "COUNT"
        | "DISTINCT"

    type AGGREGATION_METHOD_TUPLE__COMMON = [
        /* alias */
        string,
        /* real method in sql */
        AGGREGATION_METHOD_COMPLEX
    ]

    type AGGREGATION_METHOD_SQLITE = AGGREGATION_METHOD_COMMON | "RANDOM"

    type AGGREGATION_METHOD_MYSQL = 
        AGGREGATION_METHOD_COMMON
            | "CEIL"
            | "FLOOR"
            | "LOG"
            | "LOG2"
            | "LOG10"
            | "EXP"
            | "POWER"
            | "ACOS"
            | "ASIN"
            | "ATAN"
            | "COS"
            | "SIN"
            | "TAN"
            | "CONV"
            | "RAND"
            | "RADIANS"
            | "DEGREES"
            | "SUM"
            | "COUNT"
            | "DISTINCT"
    type AGGREGATION_METHOD_TUPLE__MYSQL = [ "RANDOM", "RAND" ]

    type AGGREGATION_METHOD_POSTGRESQL = 
        AGGREGATION_METHOD_COMMON
        | "CEIL"
        | "FLOOR"
        | 'RANDOM'
        | "LOG"
        | "EXP"
        | "POWER"
        | "ACOS"
        | "ASIN"
        | "ATAN"
        | "COS"
        | "SIN"
        | "TAN"
        | "RADIANS"
        | "DEGREES"

    type AGGREGATION_METHOD_COMPLEX = AGGREGATION_METHOD_POSTGRESQL | AGGREGATION_METHOD_SQLITE | AGGREGATION_METHOD_MYSQL
}