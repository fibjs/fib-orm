declare namespace FxOrmSqlDDLSync__Column {
    interface PropertyDescriptor {}

    type __StringType<ENUM_T = string> = string | ENUM_T
    type ColumnType = __StringType

    /* mysql about :start */
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
    
    interface PropertyHash {
        [col: string]: FxOrmSqlDDLSync__Column.Property
    }

    type PropertyType = __StringType<'text' | 'integer' | 'number' | 'serial' | 'boolean' | 'date' | 'binary' | 'object' | 'enum' | 'point'>

    type PropertyType_MySQL = PropertyType
    type ColumnType_MySQL =
        __StringType<PropertyType_MySQL>

    interface ColumnInfo__MySQL {
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

    interface PropertyMySQL extends Property {}

    /* sqlite about :start */
    interface ColumnInfo__SQLite {
        cid: number
		dflt_value: string
		name: string
		notnull: 1 | 0
		pk: 1 | 0
		type: ColumnType_SQLite
	}
    type PropertyType_SQLite = PropertyType
    type ColumnType_SQLite =
        __StringType<'TEXT' | 'INTEGER' | 'REAL' | 'SERIAL' | 'INTEGER UNSIGNED' | 'DATE' | 'DATETIME' | 'BLOB' | 'ENUM' | 'POINT'>

    interface PropertySQLite extends Property {
        key: boolean
        type: PropertyType_SQLite
    }
    /* sqlite about :end */
}