import { IDbDriver } from "../../db-driver/index";

import type { IProperty } from '../../orm-property/index';
import type { ColumnInfoSQLite } from '../../orm-property/transformers/sqlite';
import type { ColumnInfoMySQL } from '../../orm-property/transformers/mysql';
import type { ColumnInfoPostgreSQL } from '../../orm-property/transformers/postgresql';

import { FxOrmSqlDDLSync__Dialect } from "./Dialect";

export namespace FxOrmSqlDDLSync {
    export type TableName = string
    export type ColumnName = string

    export interface SyncOptions<ConnType extends IDbDriver.IConnTypeEnum = IDbDriver.IConnTypeEnum> {
        dbdriver: IDbDriver<ConnType>
        debug?: Function | false
        /**
         * @default true
         */
        suppressColumnDrop?: boolean
        syncStrategy?: FxOrmSqlDDLSync.SyncCollectionOptions['strategy']
    }
    export interface SyncResult {
        changes: number
    }
    export interface SyncCollectionOptions {
        columns?: Record<string, IProperty>,
        /**
         * @deprecated
         */
        strategy?: 'soft' | 'hard' | 'mixed'
        /**
         * @default true
         */
        suppressColumnDrop?: boolean
    }

    type ITransformCtx = {
        /**
         * @description database's version
         */
        version?: string

        /**
         * @description database's type
         */
        type?: FxOrmSqlDDLSync__Dialect.DialectType

        /**
         * @description collection name
         */
        collection?: string
    }
    type IGetColumnInfo<T extends IDbDriver.ISQLConn> = T extends Class_MySQL
        ? ColumnInfoMySQL
        : T extends Class_SQLite
        ? ColumnInfoSQLite
        : any
}
