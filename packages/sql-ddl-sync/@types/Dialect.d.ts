/// <reference types="@fibjs/types" />
/// <reference types="@fxjs/orm-core" />

/// <reference path="_common.d.ts" />
/// <reference path="Query.d.ts" />

declare namespace FxOrmSqlDDLSync__Dialect{
    type DialectType = 'mysql' | 'mssql' | 'sqlite' | 'postgresql'
    interface Dialect<
        DRIVER_QUERY_TYPE extends FxOrmSqlDDLSync__Query.BasicDriverQueryObject = any
    > {
        hasCollection: {
            (driver: FxOrmSqlDDLSync__Driver.Driver<DRIVER_QUERY_TYPE>, name: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<boolean>): void
        }
        hasCollectionSync: {
            (driver: FxOrmSqlDDLSync__Driver.Driver<DRIVER_QUERY_TYPE>, name: string): boolean
        }
        addPrimaryKey: {
            (driver: FxOrmSqlDDLSync__Driver.Driver<DRIVER_QUERY_TYPE>, tableName: string, columnName: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void
        }
        addPrimaryKeySync: {
            (driver: FxOrmSqlDDLSync__Driver.Driver<DRIVER_QUERY_TYPE>, tableName: string, columnName: string): any
        }
        dropPrimaryKey: {
            (driver: FxOrmSqlDDLSync__Driver.Driver<DRIVER_QUERY_TYPE>, tableName: string, columnName: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void
        }
        dropPrimaryKeySync: {
            (driver: FxOrmSqlDDLSync__Driver.Driver<DRIVER_QUERY_TYPE>, tableName: string, columnName: string): any
        }
        addForeignKey: {
            (driver: FxOrmSqlDDLSync__Driver.Driver<DRIVER_QUERY_TYPE>, tableName: string, options: any, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void
        }
        addForeignKeySync: {
            (driver: FxOrmSqlDDLSync__Driver.Driver<DRIVER_QUERY_TYPE>, tableName: string, options: any): any
        }
        dropForeignKey: {
            (driver: FxOrmSqlDDLSync__Driver.Driver<DRIVER_QUERY_TYPE>, tableName: string, columnName: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void
        }
        dropForeignKeySync: {
            (driver: FxOrmSqlDDLSync__Driver.Driver<DRIVER_QUERY_TYPE>, tableName: string, columnName: string): any
        }
        getCollectionProperties: {
            (driver: FxOrmSqlDDLSync__Driver.Driver<DRIVER_QUERY_TYPE>, name: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<FxOrmSqlDDLSync__Column.ColumnInfoHash>): void
        }
        getCollectionPropertiesSync: {
            (driver: FxOrmSqlDDLSync__Driver.Driver<DRIVER_QUERY_TYPE>, name: string): FxOrmSqlDDLSync__Column.ColumnInfoHash
        }
        createCollection: {
            (driver: FxOrmSqlDDLSync__Driver.Driver<DRIVER_QUERY_TYPE>, name: string, columns: string[], keys: string[], cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void
        }
        createCollectionSync: {
            (driver: FxOrmSqlDDLSync__Driver.Driver<DRIVER_QUERY_TYPE>, name: string, columns: string[], keys: string[]): any
        }
        dropCollection: {
            (driver: FxOrmSqlDDLSync__Driver.Driver<DRIVER_QUERY_TYPE>, name: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void
        }
        dropCollectionSync: {
            (driver: FxOrmSqlDDLSync__Driver.Driver<DRIVER_QUERY_TYPE>, name: string): any
        }
        addCollectionColumn: {
            (driver: FxOrmSqlDDLSync__Driver.Driver<DRIVER_QUERY_TYPE>, name: string, column: string, after_column: string|false, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void
        }
        addCollectionColumnSync: {
            (driver: FxOrmSqlDDLSync__Driver.Driver<DRIVER_QUERY_TYPE>, name: string, column: string, after_column: string|false): any
        }
        renameCollectionColumn: {
            (driver: FxOrmSqlDDLSync__Driver.Driver<DRIVER_QUERY_TYPE>, name: string, oldColName: string, newColName: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void
        }
        renameCollectionColumnSync: {
            (driver: FxOrmSqlDDLSync__Driver.Driver<DRIVER_QUERY_TYPE>, name: string, oldColName: string, newColName: string): any
        }
        modifyCollectionColumn: {
            (driver: FxOrmSqlDDLSync__Driver.Driver<DRIVER_QUERY_TYPE>, name: string, column: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void
        }
        modifyCollectionColumnSync: {
            (driver: FxOrmSqlDDLSync__Driver.Driver<DRIVER_QUERY_TYPE>, name: string, column: string): any
        }
        dropCollectionColumn: {
            (driver: FxOrmSqlDDLSync__Driver.Driver<DRIVER_QUERY_TYPE>, name: string, column: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void
        }
        dropCollectionColumnSync: {
            (driver: FxOrmSqlDDLSync__Driver.Driver<DRIVER_QUERY_TYPE>, name: string, column: string): any
        }
        getCollectionIndexes: {
            (driver: FxOrmSqlDDLSync__Driver.Driver<DRIVER_QUERY_TYPE>, name: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<FxOrmSqlDDLSync__DbIndex.DbIndexInfoHash>): void
        }
        getCollectionIndexesSync: {
            (driver: FxOrmSqlDDLSync__Driver.Driver<DRIVER_QUERY_TYPE>, name: string): FxOrmSqlDDLSync__DbIndex.DbIndexInfoHash
        }
        addIndex: {
            (driver: FxOrmSqlDDLSync__Driver.Driver<DRIVER_QUERY_TYPE>, name: string, unique: boolean, collection: FxOrmSqlDDLSync.TableName, columns: string[], cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void
        }
        addIndexSync: {
            (driver: FxOrmSqlDDLSync__Driver.Driver<DRIVER_QUERY_TYPE>, name: string, unique: boolean, collection: FxOrmSqlDDLSync.TableName, columns: string[]): any
        }
        removeIndex: {
            (driver: FxOrmSqlDDLSync__Driver.Driver<DRIVER_QUERY_TYPE>, name: string, collection: FxOrmSqlDDLSync.TableName, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void
        }
        removeIndexSync: {
            (driver: FxOrmSqlDDLSync__Driver.Driver<DRIVER_QUERY_TYPE>, name: string, collection: FxOrmSqlDDLSync.TableName): any
        }
        getType: {
            (collection: FxOrmSqlDDLSync.TableName, property: FxOrmSqlDDLSync__Column.Property, driver: FxOrmSqlDDLSync__Driver.Driver<DRIVER_QUERY_TYPE>): false | string | FxOrmSqlDDLSync__Column.OpResult__CreateColumn
        }

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

    interface DialectResult<T = any> {
		value: T,
		before?: false | Function
	}
}