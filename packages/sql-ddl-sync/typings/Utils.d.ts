import { FxOrmSqlDDLSync__Column } from "./Typo/Column";
import { FxOrmSqlDDLSync } from "./Typo/_common";
import { FxDbDriverNS } from "@fxjs/db-driver/typings/Typo";
import { FxOrmSqlDDLSync__Collection } from "./Typo/Collection";
import { IDbDriver } from "@fxjs/db-driver";
export declare function logJson(group: string, detail: any): string;
export declare function getSqlQueryDialect(type: FxDbDriverNS.DriverType): any;
export declare function arraify<T = any>(item: T | T[]): T[];
export declare function getCollectionMapsTo_PropertyNameDict(collection: FxOrmSqlDDLSync__Collection.Collection): {
    [k: string]: string;
};
export declare function filterPropertyDefaultValue(property: FxOrmSqlDDLSync__Column.Property, ctx: {
    collection: string;
    property: FxOrmSqlDDLSync__Column.Property;
    driver: IDbDriver;
}): any;
export declare function filterSyncStrategy(strategy: FxOrmSqlDDLSync.SyncCollectionOptions['strategy']): "soft" | "hard" | "mixed";
export declare function filterSuppressColumnDrop(suppressColumnDrop: boolean, db_type: FxDbDriverNS.DriverType): boolean;
