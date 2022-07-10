/// <reference types="@fibjs/types" />
/// <reference types="fib-pool" />
import { FxDbDriverNS } from '../Typo';
import { FxOrmCoreCallbackNS } from '@fxjs/orm-core';
declare function getDriver(name: 'mysql'): typeof MySQLDriver;
declare function getDriver(name: 'psql' | 'postgresql' | 'pg'): typeof MySQLDriver;
declare function getDriver(name: 'sqlite'): typeof SQLiteDriver;
declare function getDriver(name: 'redis'): typeof RedisDriver;
export declare namespace Driver {
    export type IConnTypeEnum = Class_DbConnection | Class_MongoDB | Class_Redis;
    type IClass_PostgreSQL = Class_DbConnection;
    type IClass_MSSQL = Class_DbConnection;
    export type ISQLConn = IClass_PostgreSQL | IClass_MSSQL | Class_SQLite | Class_MySQL;
    export type ITypedDriver<T extends IConnTypeEnum = IConnTypeEnum> = T extends ISQLConn ? SQLDriver<T> : T extends Class_MongoDB ? MongoDriver : T extends Class_Redis ? RedisDriver : Driver<T>;
    export {};
}
export declare class Driver<CONN_TYPE extends Driver.IConnTypeEnum = Driver.IConnTypeEnum> {
    static getDriver: typeof getDriver;
    static create(input: FxDbDriverNS.ConnectionInputArgs | string): MySQLDriver;
    uid: string;
    get uri(): string;
    config: FxDbDriverNS.DBConnectionConfig;
    extend_config: Fibjs.AnyObject & FxDbDriverNS.DriverBuiltInExtConfig;
    type: FxDbDriverNS.DriverType;
    connection: CONN_TYPE;
    pool: FibPoolNS.FibPool<CONN_TYPE, any>;
    get isPool(): boolean;
    get isSql(): boolean;
    get isNoSql(): boolean;
    get isCommand(): boolean;
    constructor(options: FxDbDriverNS.ConnectionInputArgs | string);
    /**
     * @description re open db connection
     */
    reopen(): CONN_TYPE;
    /**
     * @description open db connection
     */
    open(): CONN_TYPE;
    /**
     * @description close db connection
     */
    close(): void;
    /**
     * @description some db connection has `ping` method
     */
    ping(): void;
    /**
     * @description get connection instance but don't change internal status
     */
    getConnection(): CONN_TYPE;
    connectionPool(callback: (connection: CONN_TYPE) => any): any;
    useTrans(callback: (conn_for_trans: CONN_TYPE) => any): any;
    [sync_method: string]: any;
}
export declare class SQLDriver<CONN_TYPE extends Driver.IConnTypeEnum> extends Driver<CONN_TYPE> implements FxDbDriverNS.SQLDriver {
    currentDb: FxDbDriverNS.SQLDriver['currentDb'];
    switchDb(targetDb: string): void;
    /**
     * @override
     */
    begin(): void;
    /**
     * @override
     */
    commit(): void;
    /**
     * @override
     */
    trans<T>(cb: FxOrmCoreCallbackNS.ExecutionCallback<T>): boolean;
    /**
     * @override
     */
    rollback(): void;
    execute<T>(sql: string): T;
}
export declare class MySQLDriver extends SQLDriver<Class_MySQL> implements FxDbDriverNS.SQLDriver {
    constructor(conn: FxDbDriverNS.ConnectionInputArgs | string);
    switchDb(targetDb: string): void;
    open(): Class_MySQL;
    close(): void;
    ping(): void;
    begin(): void;
    commit(): void;
    trans<T = any>(cb: FxOrmCoreCallbackNS.ExecutionCallback<T>): boolean;
    rollback(): void;
    getConnection(): Class_MySQL;
    execute<T = any>(sql: string): T;
}
export declare class PostgreSQLDriver extends SQLDriver<Class_DbConnection> implements FxDbDriverNS.SQLDriver {
    constructor(conn: FxDbDriverNS.ConnectionInputArgs | string);
    switchDb(targetDb: string): void;
    open(): Class_DbConnection;
    close(): void;
    ping(): void;
    begin(): void;
    commit(): void;
    trans<T = any>(cb: FxOrmCoreCallbackNS.ExecutionCallback<T>): boolean;
    rollback(): void;
    getConnection(): Class_DbConnection;
    execute<T = any>(sql: string): T;
}
export declare class SQLiteDriver extends SQLDriver<Class_SQLite> implements FxDbDriverNS.SQLDriver {
    constructor(conn: FxDbDriverNS.ConnectionInputArgs | string);
    open(): Class_SQLite;
    close(): void;
    ping(): void;
    begin(): void;
    commit(): void;
    trans<T = any>(cb: FxOrmCoreCallbackNS.ExecutionCallback<T>): boolean;
    rollback(): void;
    getConnection(): Class_SQLite;
    execute<T = any>(sql: string): T;
}
export declare class RedisDriver extends Driver<Class_Redis> implements FxDbDriverNS.CommandDriver {
    constructor(conn: FxDbDriverNS.ConnectionInputArgs | string);
    open(): Class_Redis;
    close(): void;
    ping(): void;
    command<T = any>(cmd: string, ...args: any[]): T;
    commands<T = any>(cmds: Fibjs.AnyObject, opts?: FxDbDriverNS.CommandDriverCommandOptions): T;
    getConnection(): Class_Redis;
}
export declare class MongoDriver extends Driver<Class_MongoDB> implements FxDbDriverNS.CommandDriver {
    constructor(conn: FxDbDriverNS.ConnectionInputArgs);
    reopen(): Class_MongoDB;
    open(): Class_MongoDB;
    close(): void;
    ping(): void;
    command<T = any>(cmd: string, arg: any): T;
    commands<T = any>(cmds: Fibjs.AnyObject, opts?: FxDbDriverNS.CommandDriverCommandOptions): T;
    getConnection(): Class_MongoDB;
}
export declare type IClsSQLDriver = typeof SQLDriver;
export declare type IClsMySQLDriver = typeof MySQLDriver;
export declare type IClsPostgreSQLDriver = typeof PostgreSQLDriver;
export declare type IClsSQLiteDriver = typeof SQLiteDriver;
export declare type IClsRedisDriver = typeof RedisDriver;
export {};
