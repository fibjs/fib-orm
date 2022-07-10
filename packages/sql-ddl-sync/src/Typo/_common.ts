import { IDbDriver } from "@fxjs/db-driver";
import { FxOrmSqlDDLSync__Column } from "./Column";

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
        columns?: FxOrmSqlDDLSync__Column.PropertyHash,
        strategy?: 'soft' | 'hard' | 'mixed'
        /**
         * @default true
         */
        suppressColumnDrop?: boolean
    }
}
