import { IDbDriver } from "@fxjs/db-driver";
import { FxOrmSqlDDLSync__Column } from "./Column";
export declare namespace FxOrmSqlDDLSync {
    type TableName = string;
    type ColumnName = string;
    interface SyncOptions<ConnType = any> {
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
        columns?: FxOrmSqlDDLSync__Column.PropertyHash;
        strategy?: 'soft' | 'hard' | 'mixed';
        /**
         * @default true
         */
        suppressColumnDrop?: boolean;
    }
}
