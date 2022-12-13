export declare namespace FxOrmSqlDDLSync__SQL {
    interface TableOptions {
        name: string;
        keys?: string[];
        columns?: string[];
        comment?: string;
    }
    interface IndexOptions extends TableOptions {
        unique?: boolean;
        collection?: string;
    }
    interface TableColumnOptionsBase {
        name: string;
    }
    interface CheckTableHasColumnOptions {
        name: string;
        column: string;
    }
    interface AddColumnOptions extends TableColumnOptionsBase {
        column: string;
        first?: boolean;
        after?: string | false;
    }
    interface AlterColumnOptions extends TableColumnOptionsBase {
        column: string;
    }
    interface AlertColumnRenameOptions extends TableColumnOptionsBase {
        oldColName: string;
        newColName: string;
    }
}
