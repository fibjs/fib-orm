import { FxSqlQueryComparator } from "./Comparators"
import { FxSqlQuerySql } from "./Sql"

export namespace FxSqlQuerySubQuery {
	export interface SubQueryBuildDescriptor {
		// table name or its alias name
		table: string
		// where conditions
		/**
		 * there may be 3 kinds of normalized key-value:
		 * - FxSqlQueryComparator.SubQueryInput[]
		 * - FxSqlQueryComparator.InputValueType
		 * - FxSqlQueryComparator.QueryComparatorObject
		 * - FxSqlQueryComparator.QueryComparatorLiteralObject
		 */
		wheres: {
			[k: string]: ConjunctionInputValue | NonConjunctionInputValue
		}
		// exists query info
		exists?: FxSqlQuerySql.QueryWhereExtendItem
	}

	export type SubQueryConditions = SubQueryBuildDescriptor['wheres']

	// {'__sql': [..., ?[...]]}
	export type UnderscoreSqlInput = [FxSqlQuerySql.SqlAssignmentTuple]
	export type ConjunctionInputValue = FxSqlQueryComparator.SubQueryInput[]
	export type NonConjunctionInputValue =
		FxSqlQueryComparator.InputValueType
		| FxSqlQueryComparator.QueryComparatorObject
		| FxSqlQueryComparator.QueryComparatorLiteralObject
		| UnderscoreSqlInput

	export type WhereExistsTuple_Flatten = [
		// ['table1', {col1: 'v1'}, 'table2', {col2: Query.gte('v2')}]
		string, FxSqlQueryComparator.SubQueryInput, string, FxSqlQueryComparator.SubQueryInput
	]

	// only for sample
	export interface ConjunctionInput__Sample {
		or?: FxSqlQueryComparator.SubQueryInput[]
		and?: FxSqlQueryComparator.SubQueryInput[]
		not_or?: FxSqlQueryComparator.SubQueryInput[]
		not_and?: FxSqlQueryComparator.SubQueryInput[]
		not?: FxSqlQueryComparator.SubQueryInput[]
	}
	export type KeyOf_ConjunctionInput = keyof ConjunctionInput__Sample
	// only for sample
	export interface NonConjunctionInput__Sample {
		[k: string]: FxSqlQueryComparator.InputValueType
	}
}
