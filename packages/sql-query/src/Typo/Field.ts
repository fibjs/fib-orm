import { FxSqlQueryDialect } from './Dialect'
import { FxSqlQuerySql } from './Sql'

export namespace FxSqlQueryColumns {
	export type SelectInputArgType = string | FxSqlQuerySql.SqlSelectFieldItemDescriptor

	export interface FieldItemTypeMap {
		[key: string]: FxSqlQueryDialect.DialectFieldType
	}
}
