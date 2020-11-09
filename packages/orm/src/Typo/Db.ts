/// <reference types="fib-pool" />

import { FxDbDriverNS, IDbDriver } from "@fxjs/db-driver"
import type { FxOrmCommon } from "./_common"

export namespace FxOrmDb {
    export interface DatabaseBaseConfig extends /* FxDbDriverNS.DBConnectionConfig,  */Class_UrlObject {
        pool: FxDbDriverNS.ConnectionPoolOptions
    }

    export interface DatabaseBase<ConnType = any> extends IDbDriver<ConnType> {
        eventor: Class_EventEmitter

        query: {
            <T=any>(query: string, cb?: FxOrmCommon.GenericCallback<T>): T
        }
        
        connect: {
            (cb?: FxOrmCommon.GenericCallback<ConnType>): void
            (): ConnType
        }
    }

    export interface DatabaseBase_SQLite extends DatabaseBase<Class_SQLite> {
        readonly use_memory: boolean
        
        all: DatabaseBase_SQLite['query']
        get: DatabaseBase_SQLite['query']
    }

    // interface DatabaseBase_MySQL extends DatabaseBase<Class_MySQL> {}

    // not supported now.
    export interface DatabaseBase_PostgreSQL extends DatabaseBase {
    }

    // common
    export type AGGREGATION_METHOD_COMMON =
        "ABS"
        | "ROUND"
        | "AVG"
        | "MIN"
        | "MAX"
        | "SUM"
        | "COUNT"
        | "DISTINCT"

    export type AGGREGATION_METHOD_TUPLE__COMMON = [
        /* alias */
        string,
        /* real method in sql */
        AGGREGATION_METHOD_COMPLEX
    ]

    export type AGGREGATION_METHOD_SQLITE = AGGREGATION_METHOD_COMMON | "RANDOM"

    export type AGGREGATION_METHOD_MYSQL = 
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
    export type AGGREGATION_METHOD_TUPLE__MYSQL = [ "RANDOM", "RAND" ]

    export type AGGREGATION_METHOD_POSTGRESQL = 
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

    export type AGGREGATION_METHOD_COMPLEX = AGGREGATION_METHOD_POSTGRESQL | AGGREGATION_METHOD_SQLITE | AGGREGATION_METHOD_MYSQL
}