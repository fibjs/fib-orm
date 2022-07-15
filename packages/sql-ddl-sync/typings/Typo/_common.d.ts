/// <reference types="@fibjs/types" />
import { IDbDriver } from "@fxjs/db-driver";
import { FxOrmCoreCallbackNS } from "@fxjs/orm-core";
import { FxOrmSqlDDLSync__Column } from "./Column";
import { FxOrmSqlDDLSync__Dialect } from "./Dialect";
export declare namespace FxOrmSqlDDLSync {
    export type TableName = string;
    export type ColumnName = string;
    export interface SyncOptions<ConnType extends IDbDriver.IConnTypeEnum = IDbDriver.IConnTypeEnum> {
        dbdriver: IDbDriver<ConnType>;
        debug?: Function | false;
        /**
         * @default true
         */
        suppressColumnDrop?: boolean;
        syncStrategy?: FxOrmSqlDDLSync.SyncCollectionOptions['strategy'];
    }
    export interface SyncResult {
        changes: number;
    }
    export interface SyncCollectionOptions {
        columns?: Record<string, FxOrmSqlDDLSync__Column.Property>;
        strategy?: 'soft' | 'hard' | 'mixed';
        /**
         * @default true
         */
        suppressColumnDrop?: boolean;
    }
    type ITransformCtx = {
        /**
         * @description database's version
         */
        version?: string;
        /**
         * @description database's type
         */
        type?: FxOrmSqlDDLSync__Dialect.DialectType;
        /**
         * @description collection name
         */
        collection?: string;
    };
    type IGetColumnInfo<T extends IDbDriver.ISQLConn> = T extends Class_MySQL ? FxOrmSqlDDLSync__Column.ColumnInfo__MySQL : T extends Class_SQLite ? FxOrmSqlDDLSync__Column.ColumnInfo__SQLite : any;
    export interface Transformers<T extends IDbDriver.ISQLConn> {
        /**
         * @description some database's column info is ok, don't need normalization
         */
        buffer2ColumnsMeta?(queridInfo: {
            [P in keyof IGetColumnInfo<T>]: IGetColumnInfo<T>[P] | Class_Buffer;
        }): IGetColumnInfo<T>;
        columnInfo2Property(column: IGetColumnInfo<T>, ctx?: ITransformCtx): FxOrmSqlDDLSync__Column.Property;
        property2ColumnType(property: FxOrmSqlDDLSync__Column.Property, ctx?: ITransformCtx): {
            isCustomType: boolean;
            property: FxOrmSqlDDLSync__Column.Property;
            value: string;
            before?: false | ((driver: IDbDriver.ITypedDriver<Class_DbConnection>, cb?: FxOrmCoreCallbackNS.VoidCallback<void>) => void);
        };
    }
    export {};
}
