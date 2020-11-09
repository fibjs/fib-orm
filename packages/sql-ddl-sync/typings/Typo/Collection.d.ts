import { FxOrmSqlDDLSync__Column } from "./Column";
export declare namespace FxOrmSqlDDLSync__Collection {
    interface Collection {
        name: string;
        properties: {
            [k: string]: FxOrmSqlDDLSync__Column.Property;
        };
        [ext_k: string]: any;
    }
}
