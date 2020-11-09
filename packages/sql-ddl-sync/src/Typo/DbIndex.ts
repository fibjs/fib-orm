export namespace FxOrmSqlDDLSync__DbIndex {
    export interface DbIndexInfo {
        name?: string
        columns: string[]
        unique?: boolean
    }

    export interface DbIndexInfoHash {
        [idx_name: string]: DbIndexInfo
    }
}