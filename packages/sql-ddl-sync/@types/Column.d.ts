declare namespace FxOrmSqlDDLSync__Column {
    interface PropertyDescriptor {}

    type __StringType<ENUM_T = string> = string | ENUM_T
    type ColumnType = __StringType

    type ColumnInfo = Property

    interface ColumnInfoHash {
        [col: string]: FxOrmSqlDDLSync__Column.ColumnInfo
    }

    type PropertyType = __StringType<'text' | 'integer' | 'number' | 'serial' | 'boolean' | 'date' | 'binary' | 'object' | 'enum' | 'point'>

    type PropertyType_MySQL = PropertyType
    type ColumnType_MySQL =
        __StringType<'TEXT' | 'INT' | 'TINYINT' | 'DATE' | 'DATETIME' | 'LONGBLOB' | 'BLOB' | 'ENUM' | 'POINT'>

    interface PropertyDescriptor__MySQL {
        Field: string
        Type: string
            | 'smallint'
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
        SubType?: string[]
        Size: number | string
        /**
         * extra description such as `AUTO_INCREMENT`
         */
        Extra: string
        /**
         * @example `PRI`
         */
        Key: string
        /**
         * @example `no`
         */
        Null: string
        /**
         * @example null
         */
        Default?: any
    }

    interface Property {
        type: PropertyType

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
            driver: FxDbDriverNS.Driver,
        }) => any | any
        size?: number | string
        rational?: boolean // whether float typ
        time?: boolean
        big?: boolean
        values?: any[] // values for enum type
        /* extra option :end */

        [ext_k: string]: any
    }

    interface PropertyMySQL extends Property {}

    type PropertyType_SQLite = PropertyType
    type ColumnType_SQLite =
        __StringType<'TEXT' | 'INTEGER' | 'REAL' | 'SERIAL' | 'INTEGER UNSIGNED' | 'DATE' | 'DATETIME' | 'BLOB' | 'ENUM' | 'POINT'>

    interface PropertySQLite extends Property {
        key: boolean
        type: PropertyType_SQLite
    }

    interface OpResult__CreateColumn extends FxOrmSqlDDLSync__Dialect.DialectResult {
        value: string
        /**
         * @description hook function before column synced, pointless
         * @deprecated
         */
        before?: false | Function
    }
}