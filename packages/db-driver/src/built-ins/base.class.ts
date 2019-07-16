import db = require('db')
import url = require('url');
import assert = require('assert');
import coroutine = require('coroutine')

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

export class Driver<ConnType = any> implements FxDbDriverNS.Driver<ConnType> {
    static getDriver = function getDriver (
            name: FxDbDriverNS.DriverType | string
        ): any {
        switch (name) {
            case 'mysql':
                return MySQLDriver
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
                        return getDriver(type)
                }
                
                return Driver
        }
    }

	static create (input: FxDbDriverNS.ConnectionInputArgs | string) {
		const driver = Driver.getDriver(
			typeof input === 'object' ? input.protocol : input
		)

		return new driver(input);
	}
	
	uid: FxDbDriverNS.Driver['uid'];
    get uri () {

        return url.format({ ...this.config });
    }
	config: FxDbDriverNS.Driver['config'];
	extend_config: FxDbDriverNS.Driver['extend_config'] = {
		pool: false,
		debug: false
	};

	type: FxDbDriverNS.Driver['type'];

    connection: FxDbDriverNS.Driver<ConnType>['connection'];
    pool: FxDbDriverNS.Driver<ConnType>['pool'];

	get isPool () {
		return !!this.extend_config.pool
	}
	get isSql () {
		const p = this.config.protocol || ''

		return (
			(p === 'mysql:')
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

		const extend_config = <FxDbDriverNS.Driver['extend_config']>{}
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

export class SQLDriver<ConnType> extends Driver<ConnType> implements FxDbDriverNS.SQLDriver {
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

class MySQLDriver extends SQLDriver<Class_MySQL> implements FxDbDriverNS.SQLDriver {
    constructor (conn: FxDbDriverNS.ConnectionInputArgs) {
        super(conn);

        this.connection = null
    }

    switchDb (targetDb: string) {
        this.execute(
            db.formatMySQL("use `" + db.escape(targetDb) + "`")
        );
    }

    reopen (): void {
        try { this.close() } catch (error) {}
        this.open()
    }
    
    open (): void {
        this.close()

        this.connection = db.openMySQL(this.uri)
    }
    close (): void {
        if (this.connection)
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

        if (!this.connection) this.open()
        return this.connection.execute(sql) as any;
    }
}

class SQLiteDriver extends SQLDriver<Class_SQLite> implements FxDbDriverNS.SQLDriver {
    constructor (conn: FxDbDriverNS.ConnectionInputArgs) {
        super(conn);

        this.connection = null
    }

    reopen (): void {
        try { this.close() } catch (error) {}
        this.open()
    }
    
    open (): void {
        this.connection = db.openSQLite(this.uri)
    }

    close (): void {
        if (this.connection)
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

        if (!this.connection) this.open()
        return this.connection.execute(sql) as any;
    }
}

class RedisDriver extends Driver<Class_Redis> implements FxDbDriverNS.CommandDriver {
    constructor (conn: FxDbDriverNS.ConnectionInputArgs) {
        super(conn);

        this.connection = null
    }

    reopen (): void {
        try { this.close() } catch (error) {}
        this.open()
    }

    open (): void {
        this.connection = db.openRedis(this.uri)
    }
    close (): void {
        if (this.connection)
            this.connection.close()
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
}

class MongoDriver extends Driver<Class_MongoDB> implements FxDbDriverNS.CommandDriver {
    constructor (conn: FxDbDriverNS.ConnectionInputArgs) {
        super(conn);

        this.connection = null
    }

    reopen (): void {
        try { this.close() } catch (error) {}
        this.open()
    }

    open (): void {
        this.connection = db.openMongoDB(this.uri)
    }
    close (): void {
        if (this.connection)
            this.connection.close()
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
            return this.pool(conn => conn.runCommand(cmds));

        if (!this.connection) this.open()
        return this.connection.runCommand(cmds) as any;
    }
}

