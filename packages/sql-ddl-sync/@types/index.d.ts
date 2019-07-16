/// <reference types="@fibjs/types" />
/// <reference types="@fxjs/orm-core" />
/// <reference types="@fxjs/db-driver" />

/// <reference path="_common.d.ts" />
/// <reference path="SQL.d.ts" />
/// <reference path="Collection.d.ts" />
/// <reference path="DbIndex.d.ts" />
/// <reference path="Driver.d.ts" />
/// <reference path="Column.d.ts" />
/// <reference path="Query.d.ts" />
/// <reference path="Dialect.d.ts" />

declare namespace FxOrmSqlDDLSync {
    interface SyncOptions<DRIVER_QUERY_TYPE extends FxOrmSqlDDLSync__Query.BasicDriverQueryObject = any> {
        dbdriver: FxDbDriverNS.Driver
        debug?: Function | false
        suppressColumnDrop?: boolean
    }
    interface SyncResult {
        changes: number
    }
    class Sync {
        constructor (options: FxOrmSqlDDLSync.SyncOptions)

        defineCollection: {
            (collection_name: string, properties: FxOrmSqlDDLSync__Collection.Collection['properties']): Sync
        }
        defineType: {
            (type: string, proto: FxOrmSqlDDLSync__Driver.CustomPropertyType): Sync
        }
        sync: {
            (cb: FxOrmCoreCallbackNS.ExecutionCallback<SyncResult>): void
            (): SyncResult
        }
        forceSync: Sync['sync']

        [ext: string]: any
    }

    interface ExportModule {
        dialect(name: FxOrmSqlDDLSync__Dialect.DialectType): FxOrmSqlDDLSync__Dialect.Dialect
        Sync: {
            new (options: SyncOptions): Sync
            (options: SyncOptions): Sync
        }
    }
}

declare module "@fxjs/sql-ddl-sync" {
    const mod: FxOrmSqlDDLSync.ExportModule
    export = mod
}