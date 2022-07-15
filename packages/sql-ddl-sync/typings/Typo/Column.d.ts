/// <reference types="@fibjs/types" />
import { IDbDriver } from "@fxjs/db-driver";
export declare namespace FxOrmSqlDDLSync__Column {
    interface PropertyDescriptor {
    }
    type __StringType<ENUM_T = string> = string | ENUM_T;
    type ColumnType = __StringType;
    interface Property {
        type: PropertyType;
        key?: boolean;
        mapsTo?: string;
        unique?: boolean | string | string[];
        index?: boolean | string | string[];
        serial?: boolean;
        unsigned?: boolean;
        primary?: boolean;
        required?: boolean;
        defaultValue?: ((opts?: {
            collection: string;
            property: Property;
            driver: IDbDriver;
        }) => any) | any;
        size?: number | string;
        rational?: boolean;
        time?: boolean;
        big?: boolean;
        values?: any[];
        [ext_k: string]: any;
    }
    type PropertyType = __StringType<'text' | 'integer' | 'number' | 'serial' | 'boolean' | 'date' | 'binary' | 'object' | 'enum' | 'point'>;
    type PropertyType_MySQL = PropertyType;
    type ColumnType_MySQL = __StringType<PropertyType_MySQL>;
    interface ColumnInfo__MySQL {
        Field: string;
        Type: Class_Buffer | __StringType<'smallint' | 'integer' | 'bigint' | 'int' | 'float' | 'double' | 'tinyint' | 'datetime' | 'date' | 'longblob' | 'blob' | 'varchar'>;
        Size: number | string;
        /**
         * extra description such as `AUTO_INCREMENT`
         */
        Extra: string;
        /**
         * @example `PRI`
         */
        Key: __StringType<'PRI' | 'MUL'>;
        /**
         * @example `NO`
         */
        Null: __StringType<'NO' | 'YES'>;
        SubType?: string[];
        /**
         * @example null
         */
        Default?: any;
    }
    interface PropertyMySQL extends Property {
    }
    interface ColumnInfo__SQLite {
        cid: number;
        dflt_value: string;
        name: string;
        notnull: 1 | 0;
        pk: 1 | 0;
        type: ColumnType_SQLite;
    }
    type PropertyType_SQLite = PropertyType;
    type ColumnType_SQLite = __StringType<'TEXT' | 'INTEGER' | 'REAL' | 'SERIAL' | 'INTEGER UNSIGNED' | 'DATE' | 'DATETIME' | 'BLOB' | 'ENUM' | 'POINT'>;
    interface PropertySQLite extends Property {
        key?: boolean;
        type: PropertyType_SQLite;
        before?: string;
        after?: string;
    }
    type PropertyType_PostgreSQL = PropertyType;
    type ColumnType_PostgreSQL = __StringType<PropertyType_PostgreSQL>;
}
