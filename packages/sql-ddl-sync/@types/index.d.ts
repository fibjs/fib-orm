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
    interface SyncOptions<ConnType = any> {
        dbdriver: FxDbDriverNS.Driver<ConnType>
        debug?: Function | false
        suppressColumnDrop?: boolean
    }
    interface SyncResult {
        changes: number
    }
    class Sync<ConnType = any> {
        constructor (options: FxOrmSqlDDLSync.SyncOptions<ConnType>)
        
        // readonly collections: FxOrmSqlDDLSync__Collection.Collection[]
        readonly dbdriver: FxDbDriverNS.Driver<ConnType>
        readonly Dialect: FxOrmSqlDDLSync__Dialect.Dialect
        readonly types: FxOrmSqlDDLSync__Driver.CustomPropertyTypeHash

        defineCollection (collection_name: string, properties: FxOrmSqlDDLSync__Collection.Collection['properties']): this
        findCollection (collection_name: string): FxOrmSqlDDLSync__Collection.Collection
        defineType (type: string, proto: FxOrmSqlDDLSync__Driver.CustomPropertyType): this

        /**
         * @description
         *  create collection in db if it doesn't exist, then sync all columns for it.
         * 
         * @param collection collection relation to create 
         */
        createCollection<T = any> (collection: FxOrmSqlDDLSync__Collection.Collection): T
        
        getCollectionIndexes (
            collection: FxOrmSqlDDLSync__Collection.Collection
        ): FxOrmSqlDDLSync__DbIndex.DbIndexInfo[]
        /**
         * @description
         *  compare/diff properties between definition ones and the real ones,
         *  then sync column in definition but missing in the real
         * 
         * @param collection collection properties user provided 
         * @param columns properties from db
         */
        syncCollection (
            collection: FxOrmSqlDDLSync__Collection.Collection,
            columns: FxOrmSqlDDLSync__Column.PropertyHash
        ): void

        syncIndexes (
            collection_name: string,
            indexes: FxOrmSqlDDLSync__DbIndex.DbIndexInfo[]
        ): void

        /**
         * @description
         *  sync all collections to db (if not existing), with initializing ones' properties.
         * 
         * @callbackable
         */
        sync: {
            (cb: FxOrmCoreCallbackNS.ExecutionCallback<SyncResult>): void
            (): SyncResult
        }
        /**
         * @description
         *  sync all collections to db whatever it existed,
         *  with sync ones' properties whatever the property existed.
         * 
         * @callbackable
         */
        forceSync: Sync['sync']

        [ext: string]: any
    }

    interface ExportModule {
        dialect(name: FxOrmSqlDDLSync__Dialect.DialectType): FxOrmSqlDDLSync__Dialect.Dialect
        Sync: typeof Sync
    }
}

declare module "@fxjs/sql-ddl-sync" {
    const mod: FxOrmSqlDDLSync.ExportModule
    export = mod
}