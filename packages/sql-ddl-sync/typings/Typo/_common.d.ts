import { IDbDriver } from "@fxjs/db-driver";
import { FxOrmSqlDDLSync__Column } from "./Column";
export declare namespace FxOrmSqlDDLSync {
    type TableName = string;
    type ColumnName = string;
    interface SyncOptions<ConnType extends IDbDriver.IConnTypeEnum = IDbDriver.IConnTypeEnum> {
        dbdriver: IDbDriver<ConnType>;
        debug?: Function | false;
        /**
         * @default true
         */
        suppressColumnDrop?: boolean;
        syncStrategy?: FxOrmSqlDDLSync.SyncCollectionOptions['strategy'];
    }
    interface SyncResult {
        changes: number;
    }
    interface SyncCollectionOptions {
        columns?: Record<string, FxOrmSqlDDLSync__Column.Property>;
        strategy?: 'soft' | 'hard' | 'mixed';
        /**
         * @default true
         */
        suppressColumnDrop?: boolean;
    }
}
