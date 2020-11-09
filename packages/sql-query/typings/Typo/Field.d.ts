import { FxSqlQueryDialect } from './Dialect';
import { FxSqlQuerySql } from './Sql';
export declare namespace FxSqlQueryColumns {
    type SelectInputArgType = string | FxSqlQuerySql.SqlSelectFieldItemDescriptor;
    interface FieldItemTypeMap {
        [key: string]: FxSqlQueryDialect.DialectFieldType;
    }
}
