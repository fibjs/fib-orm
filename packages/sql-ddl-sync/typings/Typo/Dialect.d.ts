import { FxOrmCoreCallbackNS } from "@fxjs/orm-core";
import { FxOrmSqlDDLSync__Collection } from "./Collection";
import { FxOrmSqlDDLSync__DbIndex } from "./DbIndex";
import { FxOrmSqlDDLSync } from "./_common";
import { IDbDriver } from '@fxjs/db-driver';
import { FxOrmSqlDDLSync__Column } from "./Column";
export declare namespace FxOrmSqlDDLSync__Dialect {
    type DialectType = 'mysql' | 'mssql' | 'sqlite' | 'postgresql';
    interface DielectGetTypeOpts {
        for?: 'alter_table' | 'create_table' | 'add_column' | 'alter_column';
    }
    interface Dialect<ConnType = any> {
        hasCollection: {
            (driver: IDbDriver<ConnType>, name: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<boolean>): void;
        };
        hasCollectionSync: {
            (driver: IDbDriver<ConnType>, name: string): boolean;
        };
        addPrimaryKey: {
            (driver: IDbDriver<ConnType>, tableName: string, columnName: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void;
        };
        addPrimaryKeySync: {
            (driver: IDbDriver<ConnType>, tableName: string, columnName: string): any;
        };
        dropPrimaryKey: {
            (driver: IDbDriver<ConnType>, tableName: string, columnName: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void;
        };
        dropPrimaryKeySync: {
            (driver: IDbDriver<ConnType>, tableName: string, columnName: string): any;
        };
        addForeignKey: {
            (driver: IDbDriver<ConnType>, tableName: string, options: any, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void;
        };
        addForeignKeySync: {
            (driver: IDbDriver<ConnType>, tableName: string, options: any): any;
        };
        dropForeignKey: {
            (driver: IDbDriver<ConnType>, tableName: string, columnName: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void;
        };
        dropForeignKeySync: {
            (driver: IDbDriver<ConnType>, tableName: string, columnName: string): any;
        };
        getCollectionColumns: {
            <T = any>(driver: IDbDriver<ConnType>, name: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<T[]>): void;
        };
        getCollectionColumnsSync: {
            <T = any>(driver: IDbDriver<ConnType>, name: string): T[];
        };
        getCollectionProperties: {
            (driver: IDbDriver<ConnType>, name: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<FxOrmSqlDDLSync__Column.PropertyHash>): void;
        };
        getCollectionPropertiesSync: {
            (driver: IDbDriver<ConnType>, name: string): FxOrmSqlDDLSync__Column.PropertyHash;
        };
        createCollection: {
            (driver: IDbDriver<ConnType>, name: string, columns: string[], keys: string[], cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void;
        };
        createCollectionSync: {
            (driver: IDbDriver<ConnType>, name: string, columns: string[], keys: string[]): any;
        };
        dropCollection: {
            (driver: IDbDriver<ConnType>, name: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void;
        };
        dropCollectionSync: {
            (driver: IDbDriver<ConnType>, name: string): any;
        };
        hasCollectionColumnsSync: {
            (driver: IDbDriver<ConnType>, name: string, column: string | string[]): boolean;
        };
        hasCollectionColumns: {
            (driver: IDbDriver<ConnType>, name: string, column: string | string[], cb: FxOrmCoreCallbackNS.ExecutionCallback<boolean>): any;
        };
        addCollectionColumn: {
            (driver: IDbDriver<ConnType>, name: string, column: string, after_column: string | false, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void;
        };
        addCollectionColumnSync: {
            (driver: IDbDriver<ConnType>, name: string, column: string, after_column: string | false): any;
        };
        renameCollectionColumn: {
            (driver: IDbDriver<ConnType>, name: string, oldColName: string, newColName: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void;
        };
        renameCollectionColumnSync: {
            (driver: IDbDriver<ConnType>, name: string, oldColName: string, newColName: string): any;
        };
        modifyCollectionColumn: {
            (driver: IDbDriver<ConnType>, name: string, column: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void;
        };
        modifyCollectionColumnSync: {
            (driver: IDbDriver<ConnType>, name: string, column: string): any;
        };
        dropCollectionColumn: {
            (driver: IDbDriver<ConnType>, name: string, column: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void;
        };
        dropCollectionColumnSync: {
            (driver: IDbDriver<ConnType>, name: string, column: string): any;
        };
        getCollectionIndexes: {
            (driver: IDbDriver<ConnType>, name: string, cb: FxOrmCoreCallbackNS.ExecutionCallback<FxOrmSqlDDLSync__DbIndex.DbIndexInfoHash>): void;
        };
        getCollectionIndexesSync: {
            (driver: IDbDriver<ConnType>, name: string): FxOrmSqlDDLSync__DbIndex.DbIndexInfoHash;
        };
        addIndex: {
            (driver: IDbDriver<ConnType>, name: string, unique: boolean, collection: FxOrmSqlDDLSync.TableName, columns: string[], cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void;
        };
        addIndexSync: {
            (driver: IDbDriver<ConnType>, name: string, unique: boolean, collection: FxOrmSqlDDLSync.TableName, columns: string[]): any;
        };
        removeIndex: {
            (driver: IDbDriver<ConnType>, name: string, collection: FxOrmSqlDDLSync.TableName, cb: FxOrmCoreCallbackNS.ExecutionCallback<any>): void;
        };
        removeIndexSync: {
            (driver: IDbDriver<ConnType>, name: string, collection: FxOrmSqlDDLSync.TableName): any;
        };
        /**
         * transform semantic property to raw string in db
         */
        getType: (collection: FxOrmSqlDDLSync.TableName, property: FxOrmSqlDDLSync__Column.Property, driver: IDbDriver<ConnType>, opts?: DielectGetTypeOpts) => false | TypeResult;
        /**
         * process composite keys
         */
        processKeys?: {
            (keys: string[]): string[];
        };
        /**
         * transform type between property and column
         */
        supportsType?: {
            (type: string): string;
        };
        convertIndexes?: {
            (rows: FxOrmSqlDDLSync__Collection.Collection, db_idxes: FxOrmSqlDDLSync__DbIndex.DbIndexInfo[]): FxOrmSqlDDLSync__DbIndex.DbIndexInfo[];
        };
        [extra: string]: any;
    }
    interface TypeResult<T = any> {
        value: T;
    }
    type DialectResult<T = any> = TypeResult<T>;
}
