/// <reference types="@fibjs/types" />
/// <reference types="@fxjs/orm-core" />
/// <reference types="@fxjs/db-driver" />

import { FxOrmCoreCallbackNS } from "@fxjs/orm-core"
import { FxOrmSqlDDLSync__Collection } from "./Collection"
import { FxOrmSqlDDLSync__DbIndex } from "./DbIndex"
import { FxOrmSqlDDLSync } from "./_common"

import { IDbDriver } from '@fxjs/db-driver';
import { FxOrmSqlDDLSync__Column } from "./Column";

export namespace FxOrmSqlDDLSync__Dialect{
    export type DialectType = 'mysql' | 'mssql' | 'sqlite' | 'postgresql'

    export interface DielectGetTypeOpts {
        for?: 'alter_table' | 'create_table' | 'add_column' | 'alter_column'
    }

    type ITypedDriver<T extends IDbDriver.ISQLConn> = IDbDriver.ITypedDriver<T>;
    export interface Dialect<ConnType extends IDbDriver.ISQLConn> {
        hasCollection: {
            (driver: ITypedDriver<ConnType>, name: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<boolean>): void
        }
        hasCollectionSync: {
            (driver: ITypedDriver<ConnType>, name: string): boolean
        }
        addPrimaryKey: {
            (driver: ITypedDriver<ConnType>, tableName: string, columnName: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void
        }
        addPrimaryKeySync: {
            (driver: ITypedDriver<ConnType>, tableName: string, columnName: string): any
        }
        dropPrimaryKey: {
            (driver: ITypedDriver<ConnType>, tableName: string, columnName: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void
        }
        dropPrimaryKeySync: {
            (driver: ITypedDriver<ConnType>, tableName: string, columnName: string): any
        }
        addForeignKey: {
            (driver: ITypedDriver<ConnType>, tableName: string, options: any, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void
        }
        addForeignKeySync: {
            (driver: ITypedDriver<ConnType>, tableName: string, options: any): any
        }
        dropForeignKey: {
            (driver: ITypedDriver<ConnType>, tableName: string, columnName: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void
        }
        dropForeignKeySync: {
            (driver: ITypedDriver<ConnType>, tableName: string, columnName: string): any
        }
        getCollectionColumns: {
            <T = any>(driver: ITypedDriver<ConnType>, name: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<T[]>): void
        }
        getCollectionColumnsSync: {
            <T = any>(driver: ITypedDriver<ConnType>, name: string): T[]
        }
        getCollectionProperties: {
            (driver: ITypedDriver<ConnType>, name: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<FxOrmSqlDDLSync__Column.PropertyHash>): void
        }
        getCollectionPropertiesSync: {
            (driver: ITypedDriver<ConnType>, name: string): FxOrmSqlDDLSync__Column.PropertyHash
        }
        createCollection: {
            (driver: ITypedDriver<ConnType>, name: string, columns: string[], keys: string[], cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void
        }
        createCollectionSync: {
            (driver: ITypedDriver<ConnType>, name: string, columns: string[], keys: string[]): any
        }
        dropCollection: {
            (driver: ITypedDriver<ConnType>, name: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void
        }
        dropCollectionSync: {
            (driver: ITypedDriver<ConnType>, name: string): any
        }
        hasCollectionColumnsSync: {
            (driver: ITypedDriver<ConnType>, name: string, column: string | string[]): boolean
        }
        hasCollectionColumns: {
            (driver: ITypedDriver<ConnType>, name: string, column: string | string[], cb: FxOrmCoreCallbackNS.ExecutionCallback<boolean>): any
        }
        addCollectionColumn: {
            (driver: ITypedDriver<ConnType>, name: string, column: string, after_column: string|false, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void
        }
        addCollectionColumnSync: {
            (driver: ITypedDriver<ConnType>, name: string, column: string, after_column: string|false): any
        }
        renameCollectionColumn: {
            (driver: ITypedDriver<ConnType>, name: string, oldColName: string, newColName: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void
        }
        renameCollectionColumnSync: {
            (driver: ITypedDriver<ConnType>, name: string, oldColName: string, newColName: string): any
        }
        modifyCollectionColumn: {
            (driver: ITypedDriver<ConnType>, name: string, column: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void
        }
        modifyCollectionColumnSync: {
            (driver: ITypedDriver<ConnType>, name: string, column: string): any
        }
        dropCollectionColumn: {
            (driver: ITypedDriver<ConnType>, name: string, column: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void
        }
        dropCollectionColumnSync: {
            (driver: ITypedDriver<ConnType>, name: string, column: string): any
        }
        getCollectionIndexes: {
            (driver: ITypedDriver<ConnType>, name: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<FxOrmSqlDDLSync__DbIndex.DbIndexInfoHash>): void
        }
        getCollectionIndexesSync: {
            (driver: ITypedDriver<ConnType>, name: string): FxOrmSqlDDLSync__DbIndex.DbIndexInfoHash
        }
        addIndex: {
            (driver: ITypedDriver<ConnType>, name: string, unique: boolean, collection: FxOrmSqlDDLSync.TableName, columns: string[], cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void
        }
        addIndexSync: {
            (driver: ITypedDriver<ConnType>, name: string, unique: boolean, collection: FxOrmSqlDDLSync.TableName, columns: string[]): any
        }
        removeIndex: {
            (driver: ITypedDriver<ConnType>, name: string, collection: FxOrmSqlDDLSync.TableName, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void
        }
        removeIndexSync: {
            (driver: ITypedDriver<ConnType>, name: string, collection: FxOrmSqlDDLSync.TableName): any
        }
        /**
         * transform semantic property to raw string in db
         */
        getType: (
            collection: FxOrmSqlDDLSync.TableName,
            property: FxOrmSqlDDLSync__Column.Property,
            driver: ITypedDriver<ConnType>,
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

    export interface TypeResult<T = any> {
		value: T,
        before?: false | (() => any)
	}

    export type DialectResult<T = any> = TypeResult<T>
}