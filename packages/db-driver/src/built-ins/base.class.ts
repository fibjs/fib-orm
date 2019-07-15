import url = require('url');
import assert = require('assert');
import db = require('db')

import Utils = require('../utils')

function setReactivePool (driver: Driver) {
	let pool: (typeof driver.extend_config)['pool'] = false
	Object.defineProperty(driver.extend_config, 'pool', {
		set (nextVal) {
			if (nextVal) {
				pool = Utils.parsePoolConfig(nextVal)
				pool.maxsize = Utils.forceInteger(pool.maxsize, 100);
				pool.timeout = Utils.forceInteger(pool.timeout, 1000);
				
				Utils.mountPoolToDb(driver)
			} else {
				pool = false
			}
		},
		get () { return pool }
	})
}

export class Driver<ConnType = any> implements FxDbDriver__Driver.Driver<ConnType> {
    static getDriver = function getDriver (
            name: FxDbDriver__Driver.DriverType | string
        ): any {
        switch (name) {
            case 'mysql':
                return MySQLDriver
            case 'sqlite':
                return SQLiteDriver
            case 'redis':
                return RedisDriver
            default:
                if (name) {
                    const type = Utils.filterDriverType(url.parse(name).protocol)
                    if (type !== 'unknown')
                        return getDriver(type)
                }
                
                return Driver
        }
    }

	static create (input: FxDbDriver__Driver.ConnectionInputArgs | string) {
		const driver = Driver.getDriver(
			typeof input === 'object' ? input.protocol : input
		)

		return new driver(input);
	}
	
	uid: FxDbDriver__Driver.Driver['uid'];
    get uri () {
        return url.format(this.config);
    }
	config: FxDbDriver__Driver.Driver['config'];
	extend_config: FxDbDriver__Driver.Driver['extend_config'] = {
		pool: false,
		debug: false
	};

	type: FxDbDriver__Driver.Driver['type'];

    connection: FxDbDriver__Driver.Driver<ConnType>['connection'];
    pool: FxDbDriver__Driver.Driver<ConnType>['pool'];

	get isPool () {
		return !!this.extend_config.pool
	}
	get isSql () {
		const p = this.config.protocol || ''

		return (
			(p === 'mysql://')
			|| (p.startsWith('sqlite:'))
		)
	}
	get isNoSql () {
		const p = this.config.protocol || ''

		return (
			(p === 'mongo://')
		)
	}

	constructor (
		options: FxDbDriver__Driver.ConnectionInputArgs | string
	) {
		options = Utils.parseConnectionString( options )
		Object.defineProperty(this, 'config', { get () { return options } })
		assert.ok(!!this.config.protocol, '[driver.config] invalid protocol')
		
		// some db has no host
		// assert.ok(!!this.config.host, '[driver.config] invalid host')

		this.type = Utils.filterDriverType(this.config.protocol);

		const extend_config = <FxDbDriver__Driver.Driver['extend_config']>{}
		Object.defineProperty(this, 'extend_config', { get () { return extend_config } })

		setReactivePool(this)
		extend_config.pool = options.query.pool
        
		extend_config.debug = Utils.castQueryStringToBoolean(options.query.debug)

		Object.defineProperty(this, 'uid', { value: Utils.driverUUid(), writable: false, configurable: false })
	}

	/**
	 * @override
	 */
	open (): void {}

	/**
	 * @override
	 */
	close (): void {}

	/**
	 * @override
	 */
	ping (): void {}

	[sync_method: string]: any
}

export class SQLDriver<ConnType> extends Driver<ConnType> implements FxDbDriver__Driver.SQLDriver {
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

class MySQLDriver extends Driver<Class_MySQL> implements FxDbDriver__Driver.SQLDriver {
    get isBuilt() {
        return !!this.connection
    }

    constructor (conn: FxDbDriver__Driver.ConnectionInputArgs) {
        super(conn);

        this.connection = null
    }
    
    open (): void {
        this.connection = db.openMySQL(this.uri)
    }
    close (): void {
        this.connection.close()
    }
    ping (): void { return }
    begin (): void { return this.connection.begin() }
    commit (): void { return this.connection.commit() }
    trans<T = any> (cb: FxOrmCoreCallbackNS.ExecutionCallback<T>): boolean { return this.connection.trans(cb); }
    rollback (): void { return this.connection.rollback() }

    execute<T = any> (sql: string): T {
        if (this.isPool)
            return this.pool(conn => conn.execute(sql));

        return this.connection.execute(this.sql) as any;
    }
}

class SQLiteDriver extends Driver<Class_SQLite> implements FxDbDriver__Driver.SQLDriver {
    get isBuilt() {
        return !!this.connection
    }

    constructor (conn: FxDbDriver__Driver.ConnectionInputArgs) {
        super(conn);

        this.connection = null
    }
    
    open (): void {
        this.connection = db.openSQLite(this.uri)
    }
    close (): void {
        this.connection.close()
    }
    ping (): void { return }
    begin (): void { return this.connection.begin() }
    commit (): void { return this.connection.commit() }
    trans<T = any> (cb: FxOrmCoreCallbackNS.ExecutionCallback<T>): boolean { return this.connection.trans(cb); }
    rollback (): void { return this.connection.rollback() }

    execute<T = any> (sql: string): T {
        if (this.isPool)
            return this.pool(conn => conn.execute(sql));

        return this.connection.execute(this.sql) as any;
    }
}

class RedisDriver extends Driver<Class_Redis> implements FxDbDriver__Driver.RedisDriver {
    get isBuilt() {
        return !!this.connection
    }

    constructor (conn: FxDbDriver__Driver.ConnectionInputArgs) {
        super(conn);

        this.connection = null
    }
    
    open (): void {
        this.connection = db.openRedis(this.uri)
    }
    close (): void {
        this.connection.close()
    }
    ping (): void {}

    command<T = any> (cmd: string): T {
        if (this.isPool)
            return this.pool(conn => conn.command(cmd));

        return this.connection.command(this.sql) as any;
    }
}