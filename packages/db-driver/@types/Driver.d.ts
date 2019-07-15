/// <reference types="fib-pool" />
/// <reference types="@fxjs/orm-core" />
/// <reference path="_common.d.ts" />

declare namespace FxDbDriver__Driver {
    type DriverType = 'mysql' | 'sqlite' | 'redis' | 'mongodb' | 'unknown'

    interface ConnectionInputArgs {
        protocol?: string;
        /**
         * 
         * prioty: hasOwnProperty('hostname') > host
         */
        hostname?: string;
        host?: string;
        port?: number|string;
        /**
         * if auth existed, user/password would be overwritten
         */
        auth?: string;
        username?: string;
        password?: string;

        database?: string;
        pool?: boolean | ConnectionPoolOptions;
        debug?: boolean;
        pathname?: string
        query?: Fibjs.AnyObject
        href?: string
        
        [extra: string]: any
    }

    interface ConnectionPoolOptions {
        maxsize?: FibPoolNS.FibPoolOptionArgs['maxsize']
        timeout?: FibPoolNS.FibPoolOptionArgs['timeout']
        retry?: FibPoolNS.FibPoolOptionArgs['retry']
    }

    /**
     * @description plain object, not Url Object
     */
    interface DBConnectionConfig {
        protocol: ConnectionInputArgs['protocol']
        slashes: string
        query: ConnectionInputArgs['query']
        database: ConnectionInputArgs['database']
        username: ConnectionInputArgs['username']
        password: ConnectionInputArgs['password']
        host: ConnectionInputArgs['host']

        href: ConnectionInputArgs['href']
        pathname: ConnectionInputArgs['pathname']

        [extra: string]: any
    }

    interface DriverBuiltInExtConfig {
        pool: false | ConnectionPoolOptions
        debug: boolean
    }

    interface DriverExtendTransaction {
        /* transaction about :start */
        begin: {
            <T=any>(): void
        };
        commit: {
            <T=any>(): void
        };
        rollback: {
            <T=any>(): void
        };
        trans: {
            <T=any>(cb: FxOrmCoreCallbackNS.ExecutionCallback<T>): boolean
        }
        /* transaction about :end */
    }

    class Driver<ConnType = any> {
        static getDriver(
            name: FxDbDriver__Driver.DriverType | string
        ): any
        static create<CreateConnType = any> (options: ConnectionInputArgs | string): Driver<CreateConnType>

        constructor (options: ConnectionInputArgs | string)

        readonly uid: string
        readonly isPool: boolean;
        /**
         * @description whether driver is based on sql query
         */
        readonly isSql: boolean
        /**
         * @description whether driver is nosql
         */
        readonly isNoSql: boolean
        /**
         * @description whether driver is based on command
         */
        readonly isCommand: boolean

        type: DriverType
        config: DBConnectionConfig
        extend_config: Fibjs.AnyObject & DriverBuiltInExtConfig

        connection: ConnType
        pool?: FibPoolNS.FibPoolFunction<ConnType>

        // knex: FXJSKnex.FXJSKnexModule.KnexInstance
        /**
         * @description open db connection
         */
        open: {
            (): void
        }
        /**
         * @description close db connection
         */
        close: {
            (): void
        }
        /**
         * @description some db connection has `ping` method
         */
        ping: {
            (): void
        }

        [ext_key: string]: any
    }

    interface DriverConfig {
        database: string

        [ext_cfg_name: string]: any
    }
}

declare namespace FxDbDriver__Driver {
    type DriverUidType = string

    interface QueryDataPayload {
        [key: string]: any
    }

    interface QueriedCountDataPayload {
        c: number
    }
}

declare namespace FxDbDriver__Driver_SQLShared {
    interface SyncOptions {
        id: string[]
        table: string
    }

    interface DropOptions {
        table: string
    }
}

declare namespace FxDbDriver__Driver {
    interface SQLDriver extends Driver, DriverExtendTransaction {
        currentDb: string
        switchDb (targetDb: string): void

        execute: {
            <T=any>(sql: string): T;
        }
    }

    interface CommandDriverCommandOptions {
        parallel?: boolean
    }
    interface CommandDriver extends Driver {
        command: {
            <T=any>(cmd: string, ...args: any[]): T;
        }
        commands: {
            <T=any>(cmds: Fibjs.AnyObject, opts?: CommandDriverCommandOptions): T;
        }
    }
}