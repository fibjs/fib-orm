export namespace FxOrmSqlDDLSync__SQL {
    export interface TableOptions {
        name: string

        keys?: string[]
        columns?: string[]

        comment?: string
    }

    export interface IndexOptions extends TableOptions {
        unique?: boolean
        // table/collection name
        collection?: string
    }

    export interface TableColumnOptionsBase {
        // table/collection name
        name: string
    }

    export interface CheckTableHasColumnOptions {
        // table/collection name
        name: string
        // column name
        column: string
    }

    export interface AddColumnOptions extends TableColumnOptionsBase {
        // column name
        column: string
        first?: boolean
        after?: string|false
    }

    export interface AlterColumnOptions extends TableColumnOptionsBase {
        // column name
        column: string
    }

    export interface AlertColumnRenameOptions extends TableColumnOptionsBase {
        oldColName: string
        newColName: string
    }
}