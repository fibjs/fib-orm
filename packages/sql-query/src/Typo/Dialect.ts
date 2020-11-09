import { FxSqlQuery } from "./Query"
import { FxSqlQuerySql } from "./Sql"

export namespace FxSqlQueryDialect {
	export type DialectType = 'mysql' | 'mssql' | 'sqlite'/*  | 'postgresql' */

	export interface DataTypesDescriptorBase {
		id: string
		int: string
		float: string
		bool: string
		text: string
	}

	export type DialectFieldType = keyof DataTypesDescriptorBase

	export interface DataTypesDescriptor extends DataTypesDescriptorBase {
		isSQLITE?: boolean
	}

	export interface Dialect {
		DataTypes: DataTypesDescriptor
		type: DialectType

		escape: {
			(
				query: FxSqlQuerySql.SqlFragmentStr,
				args: FxSqlQuerySql.SqlAssignmentValues
			): string
		}
		escapeId: {
			(...els: (FxSqlQuerySql.SqlEscapeArgIdType | {str: string, escapes: string[]})[]): string
		}
		escapeVal: {
			(val: FxSqlQuerySql.SqlEscapeArgType, timezone?: FxSqlQuery.FxSqlQueryTimezone): string
			(vals: FxSqlQuerySql.DetailedQueryWhereCondition__InStyle['val'], timezone?: FxSqlQuery.FxSqlQueryTimezone): string
		}

		limitAsTop: boolean

		readonly knex: import('@fxjs/knex')
	}

	export type fn_escape = Dialect['escape']
	export type fn_escapeId = Dialect['escapeId']
	export type fn_escapeVal = Dialect['escapeVal']
}
