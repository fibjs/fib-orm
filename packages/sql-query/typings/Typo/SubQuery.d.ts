import { FxSqlQueryComparator } from "./Comparators";
import { FxSqlQuerySql } from "./Sql";
export declare namespace FxSqlQuerySubQuery {
    interface SubQueryBuildDescriptor {
        table: string;
        /**
         * there may be 3 kinds of normalized key-value:
         * - FxSqlQueryComparator.SubQueryInput[]
         * - FxSqlQueryComparator.InputValueType
         * - FxSqlQueryComparator.QueryComparatorObject
         * - FxSqlQueryComparator.QueryComparatorLiteralObject
         */
        wheres: {
            [k: string]: ConjunctionInputValue | NonConjunctionInputValue;
        };
        exists?: FxSqlQuerySql.QueryWhereExtendItem;
    }
    type SubQueryConditions = SubQueryBuildDescriptor['wheres'];
    type UnderscoreSqlInput = [FxSqlQuerySql.SqlAssignmentTuple];
    type ConjunctionInputValue = FxSqlQueryComparator.SubQueryInput[];
    type NonConjunctionInputValue = FxSqlQueryComparator.InputValueType | FxSqlQueryComparator.QueryComparatorObject | FxSqlQueryComparator.QueryComparatorLiteralObject | UnderscoreSqlInput;
    type WhereExistsTuple_Flatten = [
        string,
        FxSqlQueryComparator.SubQueryInput,
        string,
        FxSqlQueryComparator.SubQueryInput
    ];
    interface ConjunctionInput__Sample {
        or?: FxSqlQueryComparator.SubQueryInput[];
        and?: FxSqlQueryComparator.SubQueryInput[];
        not_or?: FxSqlQueryComparator.SubQueryInput[];
        not_and?: FxSqlQueryComparator.SubQueryInput[];
        not?: FxSqlQueryComparator.SubQueryInput[];
    }
    type KeyOf_ConjunctionInput = keyof ConjunctionInput__Sample;
    interface NonConjunctionInput__Sample {
        [k: string]: FxSqlQueryComparator.InputValueType;
    }
}
