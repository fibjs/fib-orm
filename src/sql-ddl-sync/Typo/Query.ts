export namespace FxOrmSqlDDLSync__Query {
    export interface BasicDriverQueryObject {
        escapeVal (...args: any[]): string
        escapeId (...args: any[]): string

        [k: string]: any
    }
}