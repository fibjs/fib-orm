/// <reference path="Column.d.ts" />

declare namespace FxDbDriver__Collection {
    interface Collection {
        // table name
        name: string
        properties: {
            [k: string]: FxDbDriver__Column.Property
        }
        
        [ext_k: string]: any
    }
}