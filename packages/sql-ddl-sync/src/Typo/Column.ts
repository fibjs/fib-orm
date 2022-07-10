import { IDbDriver } from "@fxjs/db-driver"

export namespace FxOrmSqlDDLSync__Column {
    export interface PropertyDescriptor {}

    export type __StringType<ENUM_T = string> = string | ENUM_T
    export type ColumnType = __StringType

    /* mysql about :start */
    export interface Property {
        type: PropertyType

        key?: boolean
        mapsTo?: string

        unique?: boolean | string | string[]
        index?: boolean | string | string[]

        /* extra option :start */
        serial?: boolean
        unsigned?: boolean
        primary?: boolean
        required?: boolean
        defaultValue?: (opts?: {
            collection: string,
            property: Property,
            driver: IDbDriver,
        }) => any | any
        size?: number | string
        rational?: boolean // whether float typ
        time?: boolean
        big?: boolean
        values?: any[] // values for enum type
        /* extra option :end */

        [ext_k: string]: any
    }
    
    /**
     * @deprecated use Record<string, FxOrmSqlDDLSync__Column.Property> instead
     */
    export interface PropertyHash {
        [col: string]: FxOrmSqlDDLSync__Column.Property
    }

    export type PropertyType = __StringType<'text' | 'integer' | 'number' | 'serial' | 'boolean' | 'date' | 'binary' | 'object' | 'enum' | 'point'>

    export type PropertyType_MySQL = PropertyType
    export type ColumnType_MySQL =
        __StringType<PropertyType_MySQL>

    export interface ColumnInfo__MySQL {
        Field: string
        Type: Class_Buffer | __StringType<
            'smallint'
            | 'integer'
            | 'bigint'
            | 'int'
            | 'float'
            | 'double'
            | 'tinyint'
            | 'datetime'
            | 'date'
            | 'longblob'
            | 'blob'
            | 'varchar'
        >
        Size: number | string
        /**
         * extra description such as `AUTO_INCREMENT`
         */
        Extra: string
        /**
         * @example `PRI`
         */
        Key: __StringType<'PRI' | 'MUL'>
        /**
         * @example `NO`
         */
        Null: __StringType<'NO' | 'YES'>
        SubType?: string[]
        /**
         * @example null
         */
        Default?: any
    }
    /* mysql about :end */

    export interface PropertyMySQL extends Property {}

    /* sqlite about :start */
    export interface ColumnInfo__SQLite {
        cid: number
		dflt_value: string
		name: string
		notnull: 1 | 0
		pk: 1 | 0
		type: ColumnType_SQLite
	}
    export type PropertyType_SQLite = PropertyType
    export type ColumnType_SQLite =
        __StringType<'TEXT' | 'INTEGER' | 'REAL' | 'SERIAL' | 'INTEGER UNSIGNED' | 'DATE' | 'DATETIME' | 'BLOB' | 'ENUM' | 'POINT'>

    export interface PropertySQLite extends Property {
        key: boolean
        type: PropertyType_SQLite

        before?: string
        after?: string
    }
    /* sqlite about :end */
}