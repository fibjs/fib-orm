import { FxOrmSqlDDLSync__Column } from "./Column";

export namespace FxOrmSqlDDLSync__Collection {
    export interface Collection {
        // table name
        name: string
        properties: {
            [k: string]: FxOrmSqlDDLSync__Column.Property
        }
        
        [ext_k: string]: any
    }
}