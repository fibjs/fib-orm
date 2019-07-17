/// <reference types="@fibjs/types" />
/// <reference types="@fxjs/orm-core" />
/// <reference types="@fxjs/db-driver" />

/// <reference path="_common.d.ts" />
/// <reference path="Query.d.ts" />

declare namespace FxOrmSqlDDLSync__Dialect{
    type DialectType = 'mysql' | 'mssql' | 'sqlite' | 'postgresql'

    interface DielectGetTypeOpts {
        for?: 'alter_table' | 'create_table' | 'add_column' | 'alter_column'
    }

    interface Dialect<ConnType=any> {
        hasCollection: {
            (driver: FxDbDriverNS.Driver<ConnType>, name: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<boolean>): void
        }
        hasCollectionSync: {
            (driver: FxDbDriverNS.Driver<ConnType>, name: string): boolean
        }
        addPrimaryKey: {
            (driver: FxDbDriverNS.Driver<ConnType>, tableName: string, columnName: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void
        }
        addPrimaryKeySync: {
            (driver: FxDbDriverNS.Driver<ConnType>, tableName: string, columnName: string): any
        }
        dropPrimaryKey: {
            (driver: FxDbDriverNS.Driver<ConnType>, tableName: string, columnName: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void
        }
        dropPrimaryKeySync: {
            (driver: FxDbDriverNS.Driver<ConnType>, tableName: string, columnName: string): any
        }
        addForeignKey: {
            (driver: FxDbDriverNS.Driver<ConnType>, tableName: string, options: any, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void
        }
        addForeignKeySync: {
            (driver: FxDbDriverNS.Driver<ConnType>, tableName: string, options: any): any
        }
        dropForeignKey: {
            (driver: FxDbDriverNS.Driver<ConnType>, tableName: string, columnName: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void
        }
        dropForeignKeySync: {
            (driver: FxDbDriverNS.Driver<ConnType>, tableName: string, columnName: string): any
        }
        getCollectionColumns: {
            <T = any>(driver: FxDbDriverNS.Driver<ConnType>, name: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<T[]>): void
        }
        getCollectionColumnsSync: {
            <T = any>(driver: FxDbDriverNS.Driver<ConnType>, name: string): T[]
        }
        getCollectionProperties: {
            (driver: FxDbDriverNS.Driver<ConnType>, name: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<FxOrmSqlDDLSync__Column.PropertyHash>): void
        }
        getCollectionPropertiesSync: {
            (driver: FxDbDriverNS.Driver<ConnType>, name: string): FxOrmSqlDDLSync__Column.PropertyHash
        }
        createCollection: {
            (driver: FxDbDriverNS.Driver<ConnType>, name: string, columns: string[], keys: string[], cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void
        }
        createCollectionSync: {
            (driver: FxDbDriverNS.Driver<ConnType>, name: string, columns: string[], keys: string[]): any
        }
        dropCollection: {
            (driver: FxDbDriverNS.Driver<ConnType>, name: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void
        }
        dropCollectionSync: {
            (driver: FxDbDriverNS.Driver<ConnType>, name: string): any
        }
        hasCollectionColumnsSync: {
            (driver: FxDbDriverNS.Driver<ConnType>, name: string, column: string | string[]): boolean
        }
        hasCollectionColumns: {
            (driver: FxDbDriverNS.Driver<ConnType>, name: string, column: string | string[], cb: FxOrmCoreCallbackNS.ExecutionCallback<boolean>): any
        }
        addCollectionColumn: {
            (driver: FxDbDriverNS.Driver<ConnType>, name: string, column: string, after_column: string|false, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void
        }
        addCollectionColumnSync: {
            (driver: FxDbDriverNS.Driver<ConnType>, name: string, column: string, after_column: string|false): any
        }
        renameCollectionColumn: {
            (driver: FxDbDriverNS.Driver<ConnType>, name: string, oldColName: string, newColName: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void
        }
        renameCollectionColumnSync: {
            (driver: FxDbDriverNS.Driver<ConnType>, name: string, oldColName: string, newColName: string): any
        }
        modifyCollectionColumn: {
            (driver: FxDbDriverNS.Driver<ConnType>, name: string, column: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void
        }
        modifyCollectionColumnSync: {
            (driver: FxDbDriverNS.Driver<ConnType>, name: string, column: string): any
        }
        dropCollectionColumn: {
            (driver: FxDbDriverNS.Driver<ConnType>, name: string, column: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void
        }
        dropCollectionColumnSync: {
            (driver: FxDbDriverNS.Driver<ConnType>, name: string, column: string): any
        }
        getCollectionIndexes: {
            (driver: FxDbDriverNS.Driver<ConnType>, name: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<FxOrmSqlDDLSync__DbIndex.DbIndexInfoHash>): void
        }
        getCollectionIndexesSync: {
            (driver: FxDbDriverNS.Driver<ConnType>, name: string): FxOrmSqlDDLSync__DbIndex.DbIndexInfoHash
        }
        addIndex: {
            (driver: FxDbDriverNS.Driver<ConnType>, name: string, unique: boolean, collection: FxOrmSqlDDLSync.TableName, columns: string[], cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void
        }
        addIndexSync: {
            (driver: FxDbDriverNS.Driver<ConnType>, name: string, unique: boolean, collection: FxOrmSqlDDLSync.TableName, columns: string[]): any
        }
        removeIndex: {
            (driver: FxDbDriverNS.Driver<ConnType>, name: string, collection: FxOrmSqlDDLSync.TableName, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void
        }
        removeIndexSync: {
            (driver: FxDbDriverNS.Driver<ConnType>, name: string, collection: FxOrmSqlDDLSync.TableName): any
        }
        /**
         * transform semantic property to raw string in db
         */
        getType: (
            collection: FxOrmSqlDDLSync.TableName,
            property: FxOrmSqlDDLSync__Column.Property,
            driver: FxDbDriverNS.Driver<ConnType>,
            opts?: DielectGetTypeOpts
        ) => false | TypeResult

        /**
         * process composite keys
         */
        processKeys?: {
            (keys: string[]): string[]
        }
        /**
         * transform type between property and column
         */
        supportsType?: {
            (type: string): string
        }

        convertIndexes?: {
            (rows: FxOrmSqlDDLSync__Collection.Collection, db_idxes: FxOrmSqlDDLSync__DbIndex.DbIndexInfo[]): FxOrmSqlDDLSync__DbIndex.DbIndexInfo[]
        }

        [extra: string]: any
    }

    interface TypeResult<T = any> {
		value: T,
	}

    type DialectResult<T = any> = TypeResult<T>
}