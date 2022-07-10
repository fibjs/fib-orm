/// <reference types="fib-pool" />

import db = require('db')
import url = require('url');
import assert = require('assert');
import coroutine = require('coroutine')

import Utils = require('../utils')
import { FxDbDriverNS } from '../Typo';
import { FxOrmCoreCallbackNS } from '@fxjs/orm-core';

function setReactivePool (driver: Driver) {
	let pool: (typeof driver.extend_config)['pool'] = false
	Object.defineProperty(driver.extend_config, 'pool', {
		set (nextVal) {
            if (typeof nextVal === 'string')
                nextVal = Utils.castQueryStringToBoolean(nextVal)
                
			if (nextVal) {
				pool = Utils.parsePoolConfig(nextVal)
				pool.maxsize = Utils.forceInteger(pool.maxsize, 100);
				pool.timeout = Utils.forceInteger(pool.timeout, 1000);
				
				Utils.mountPoolToDriver(driver, pool)
			} else {
				pool = false
			}
		},
		get () { return pool }
	})
}

function getDriver (name: 'mysql'): typeof MySQLDriver
function getDriver (name: 'psql' | 'postgresql' | 'pg'): typeof MySQLDriver
function getDriver (name: 'sqlite'): typeof SQLiteDriver
function getDriver (name: 'redis'): typeof RedisDriver
function getDriver (name: FxDbDriverNS.DriverType | string) {
    switch (name) {
        case 'mysql':
            return MySQLDriver
        case 'postgresql':
        case 'pg':
        case 'psql':
            return PostgreSQLDriver
        case 'sqlite':
            return SQLiteDriver
        case 'redis':
            return RedisDriver
        case 'mongodb':
            return MongoDriver
        default:
            if (name) {
                const type = Utils.filterDriverType(url.parse(name).protocol)
                if (type !== 'unknown')
                    return getDriver(type as any)
            }
            
            return Driver
    }
}

export namespace Driver {
    export type IConnTypeEnum = Class_DbConnection | Class_MongoDB | Class_Redis;
    type IClass_PostgreSQL = Class_DbConnection;
    type IClass_MSSQL = Class_DbConnection;
    export type ISQLConn = IClass_PostgreSQL | IClass_MSSQL | Class_SQLite | Class_MySQL;

    export type ITypedDriver<T extends IConnTypeEnum = IConnTypeEnum> =
        T extends ISQLConn ? SQLDriver<T>
        : T extends Class_MongoDB ? MongoDriver
        : T extends Class_Redis ? RedisDriver
        : Driver<T>
}

export class Driver<CONN_TYPE extends Driver.IConnTypeEnum = Driver.IConnTypeEnum> {
    static getDriver = getDriver;

	static create (input: FxDbDriverNS.ConnectionInputArgs | string) {
		const driver = Driver.getDriver(
			typeof input === 'object' ? input.protocol : input as any
		)

		return new driver(input);
	}
	
	uid: string;
    get uri () {        
        return url.format({
            ...this.config,
            slashes: this.config.protocol === 'sqlite:' ? false : this.config.slashes,
            query: this.config.protocol === 'sqlite:' ? {} : this.config.query
        });
    }
	config: FxDbDriverNS.DBConnectionConfig;
	extend_config: Fibjs.AnyObject & FxDbDriverNS.DriverBuiltInExtConfig = {
		pool: false,
		debug: false
	};

	type: FxDbDriverNS.DriverType;

    connection: CONN_TYPE;
    pool: FibPoolNS.FibPool<CONN_TYPE, any>;

	get isPool () {
		return !!this.extend_config.pool
	}
	get isSql () {
		const p = this.config.protocol || ''

		return (
			(p === 'mysql:')
			|| (p === 'mssql:')
			|| (p === 'psql:')
			|| (p.startsWith('sqlite:'))
		)
	}
	get isNoSql () {
		const p = this.config.protocol || ''

		return (
			(p === 'mongodb:')
		)
	}
	get isCommand () {
		const p = this.config.protocol || ''

		return (
			(p === 'mongodb:')
            || (p === 'redis:')
		)
	}

	constructor (
		options: FxDbDriverNS.ConnectionInputArgs | string
	) {
		options = Utils.parseConnectionString( options )
		Object.defineProperty(this, 'config', { get () { return options } })
		assert.ok(!!this.config.protocol, '[driver.config] invalid protocol')
		
		// some db has no host
		// assert.ok(!!this.config.host, '[driver.config] invalid host')

		this.type = Utils.filterDriverType(this.config.protocol);

		const extend_config = <Driver['extend_config']>{}
		Object.defineProperty(this, 'extend_config', { get () { return extend_config } })

		setReactivePool(this)
		extend_config.pool = options.query.pool
        
		extend_config.debug = Utils.castQueryStringToBoolean(options.query.debug)

		Object.defineProperty(this, 'uid', { value: Utils.driverUUid(), writable: false, configurable: false })
	}


    /**
     * @description re open db connection
     */
	reopen () {
        try { this.close() } catch (error) {}
        return this.open()
    }


    /**
     * @description open db connection
     */
	open (): CONN_TYPE {
        return this.connection = this.getConnection()
    }


    /**
     * @description close db connection
     */
	close (): void {}


    /**
     * @description some db connection has `ping` method
     */
	ping (): void {}

    /**
     * @description get connection instance but don't change internal status
     */
    getConnection (): CONN_TYPE { return null as any }

    connectionPool (callback: (connection: CONN_TYPE) => any) {
        if (this.isPool)
            return this.pool((conn) => callback(conn))
        
        return callback(this.getConnection())
    }

    useTrans (callback: (conn_for_trans: CONN_TYPE) => any) {
        return this.connectionPool((conn: any) => {
            if (typeof conn.trans === 'function') {
                const waitor = {
                    ev: new (coroutine.Event)(),
                    result: <any>undefined
                }
                conn.trans(() => {
                    waitor.result = callback(conn)
                    waitor.ev.set()
                })
                waitor.ev.wait()

                return waitor.result
            } else {
                return callback(conn)
            }
        })
    }

	[sync_method: string]: any
}

export class SQLDriver<CONN_TYPE extends Driver.IConnTypeEnum> extends Driver<CONN_TYPE> implements FxDbDriverNS.SQLDriver {
    currentDb: FxDbDriverNS.SQLDriver['currentDb'] = null;
    switchDb (targetDb: string): void {};

	/**
	 * @override
	 */
	begin (): void {}

	/**
	 * @override
	 */
	commit (): void {}

	/**
	 * @override
	 */
	trans <T> (cb: FxOrmCoreCallbackNS.ExecutionCallback<T>): boolean { return true; }

	/**
	 * @override
	 */
	rollback (): void {}

	execute<T> (sql: string): T { return }
}

export class MySQLDriver extends SQLDriver<Class_MySQL> implements FxDbDriverNS.SQLDriver {
    constructor (conn: FxDbDriverNS.ConnectionInputArgs | string) {
        super(conn);

        this.connection = null
    }

    switchDb (targetDb: string) {
        this.execute(`use \`${targetDb}\``);
    }
    
    open (): Class_MySQL { return super.open() }
    close (): void {
        if (this.connection) this.connection.close()
    }
    ping (): void { return }
    begin (): void { return this.connection.begin() }
    commit (): void { return this.connection.commit() }
    trans<T = any> (cb: FxOrmCoreCallbackNS.ExecutionCallback<T>): boolean { return this.connection.trans(cb); }
    rollback (): void { return this.connection.rollback() }

    getConnection (): Class_MySQL { return db.openMySQL(this.uri) }

    execute<T = any> (sql: string): T {
        if (this.isPool)
            return this.pool(conn => conn.execute(sql)) as any;

        if (!this.connection) this.open()
        return this.connection.execute(sql) as any;
    }
}

export class PostgreSQLDriver extends SQLDriver<Class_DbConnection> implements FxDbDriverNS.SQLDriver {
    constructor (conn: FxDbDriverNS.ConnectionInputArgs | string) {
        super(conn);

        this.connection = null
    }

    switchDb (targetDb: string) {
        this.execute(`\\c ${targetDb};`);
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

    getConnection (): Class_DbConnection { return db.openPSQL(this.uri) }

    execute<T = any> (sql: string): T {
        if (this.isPool)
            return this.pool(conn => conn.execute(sql)) as any;

        if (!this.connection) this.open()
        return this.connection.execute(sql) as any;
    }
}

export class SQLiteDriver extends SQLDriver<Class_SQLite> implements FxDbDriverNS.SQLDriver {
    constructor (conn: FxDbDriverNS.ConnectionInputArgs | string) {
        super(conn);

        this.connection = null
    }
    
    open (): Class_SQLite { return super.open() }

    close (): void {
        if (this.connection) this.connection.close()
    }
    ping (): void { return }
    begin (): void { return this.connection.begin() }
    commit (): void { return this.connection.commit() }
    trans<T = any> (cb: FxOrmCoreCallbackNS.ExecutionCallback<T>): boolean { return this.connection.trans(cb); }
    rollback (): void { return this.connection.rollback() }

    getConnection (): Class_SQLite { return db.openSQLite(this.uri) }

    execute<T = any> (sql: string): T {
        if (this.isPool)
            return this.pool(conn => conn.execute(sql)) as any;

        if (!this.connection) this.open()
        return this.connection.execute(sql) as any;
    }
}

export class RedisDriver extends Driver<Class_Redis> implements FxDbDriverNS.CommandDriver {
    constructor (conn: FxDbDriverNS.ConnectionInputArgs | string) {
        super(conn);

        this.connection = null
    }

    open (): Class_Redis { return super.open() }

    close (): void {
        if (this.connection) this.connection.close()
    }
    
    ping (): void {}

    command<T = any> (cmd: string, ...args: any[]): T {
        if (this.isPool)
            return this.pool(conn => conn.command(cmd, ...args));

        if (!this.connection) this.open()
        return this.connection.command(cmd, ...args) as any;
    }

    commands<T = any> (
        cmds: Fibjs.AnyObject,
        opts?: FxDbDriverNS.CommandDriverCommandOptions
    ): T {
        const { parallel = false } = opts || {};
        const keys = Object.keys(cmds)

        if (parallel)
            return coroutine.parallel(keys, (cmd: string) => {
                return { cmd, result: this.command(cmd, ...Utils.arraify(cmds[cmd])) }
            }) as any
        else
            return Object.keys(cmds).map((cmd: string) => {
                return { cmd, result: this.command(cmd, ...Utils.arraify(cmds[cmd])) }
            }) as any
    }

    getConnection (): Class_Redis { return db.openRedis(this.uri) }
}

export class MongoDriver extends Driver<Class_MongoDB> implements FxDbDriverNS.CommandDriver {
    constructor (conn: FxDbDriverNS.ConnectionInputArgs) {
        super(conn);

        this.connection = null
    }

    reopen () {
        try { this.close() } catch (error) {}
        return this.open()
    }

    open (): Class_MongoDB { return super.open() }
    close (): void {
        if (this.connection) this.connection.close()
    }
    
    ping (): void {}

    command<T = any> (cmd: string, arg: any): T {
        return this.commands({ [cmd]: arg })
    }

    commands<T = any> (
        cmds: Fibjs.AnyObject,
        opts?: FxDbDriverNS.CommandDriverCommandOptions
    ): T {
        if (this.isPool)
            return this.pool(conn => conn.runCommand(cmds)) as any;

        if (!this.connection) this.open()
        return this.connection.runCommand(cmds) as any;
    }

    getConnection (): Class_MongoDB { return db.openMongoDB(this.uri) }
}

export type IClsSQLDriver = typeof SQLDriver;
export type IClsMySQLDriver = typeof MySQLDriver;
export type IClsPostgreSQLDriver = typeof PostgreSQLDriver;
export type IClsSQLiteDriver = typeof SQLiteDriver;
export type IClsRedisDriver = typeof RedisDriver;