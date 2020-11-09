import { FxSqlAggregation } from "./Aggregation";
import { FxSqlQueryComparator } from "./Comparators";
import { FxSqlQueryDialect } from "./Dialect";
import { FxSqlQueryHelpler } from "./Helper";
import { FxSqlQuerySubQuery } from "./SubQuery";
import { FxSqlQuery } from './Query';
export declare namespace FxSqlQuerySql {
    type DataToSet = {
        [key: string]: any;
    };
    type SqlResultStr = string;
    type SqlFragmentStr = string;
    type SqlQueryStr = string;
    type SqlEscapeArgType = string | number | boolean | Date | String | Number | RegExp | Symbol;
    type SqlEscapeArgIdType = string | number;
    type SqlAssignmentValues = SqlEscapeArgType[];
    type SqlAssignmentTuple = [FxSqlQuerySql.SqlFragmentStr, [...SqlAssignmentValues]?];
    type SqlTableRaw = string;
    type SqlTableAliasRaw = string;
    type SqlTableTuple = [string, string];
    type SqlTableInputType = SqlTableRaw | SqlTableAliasRaw | SqlTableTuple;
    type WhereObj = {
        str: string;
        escapes: any[];
    };
    type WhereExistsLinkTuple_L1 = FxSqlQueryHelpler.BinaryTuple<string>;
    type WhereExistsLinkTuple_L2 = FxSqlQueryHelpler.BinaryTuple<string[]>;
    type WhereExistsLinkTuple = WhereExistsLinkTuple_L1 | WhereExistsLinkTuple_L2;
    interface DetailedQueryWhereCondition<T = any> extends FxSqlQueryComparator.QueryComparatorObject<T> {
        from: string;
        to: string;
        expr: FxSqlQueryComparator.QueryComparatorExprType;
        val: T;
        where: WhereObj;
    }
    type DetailedQueryWhereCondition__InStyle = DetailedQueryWhereCondition<FxSqlQueryComparator.InputValue_in['in'] | FxSqlQueryComparator.InputValue_not_in['not_in']>;
    interface QueryWhereConjunctionHash {
        or?: FxSqlQueryComparator.Input[];
        and?: FxSqlQueryComparator.Input[];
        not_or?: FxSqlQueryComparator.Input[];
        not_and?: FxSqlQueryComparator.Input[];
        not?: FxSqlQueryComparator.Input[];
    }
    interface QueryWhereExtendItem {
        table: string;
        link_info: FxSqlQueryHelpler.Arraiable<any>;
        table_linked: string;
    }
    type SqlColumnDescriptorDataType = any;
    interface SqlColumnDescriptor {
        data: SqlColumnDescriptorDataType;
        type?(): string;
    }
    type NormalizedSimpleSqlColumnType = string | '*';
    type SqlColumnType = (SqlColumnDescriptor | string)[] | NormalizedSimpleSqlColumnType;
    interface SqlSelectFieldItemDescriptor {
        func_name?: string;
        column_name?: SqlColumnType;
        as?: FxSqlQuerySql.NormalizedSimpleSqlColumnType;
        a?: SqlSelectFieldItemDescriptor['as'];
        func_stack?: FxSqlAggregation.SupportedAggregationFunction[];
        sql?: string;
        select?: string;
        having?: string;
    }
    type SqlSelectFieldsDescriptor = SqlSelectFieldItemDescriptor;
    interface SqlSelectFieldsGenerator {
        (dialect: FxSqlQueryDialect.Dialect): string;
    }
    type SqlSelectFieldsType = SqlFragmentStr | SqlSelectFieldItemDescriptor | SqlSelectFieldsGenerator;
    interface QueryFromDescriptorOpts {
        joinType: string;
    }
    interface QueryFromDescriptor {
        table: string;
        alias: string;
        a?: string;
        joins?: QueryFromJoinTupleDescriptor[];
        select?: SqlSelectFieldsType[];
        opts?: QueryFromDescriptorOpts;
    }
    type QueryFromJoinTupleDescriptor = [
        string,
        string,
        string
    ];
    type SqlTableOrderTuple = [
        string,
        string
    ];
    interface SqlOrderDescriptor {
        c: string | SqlTableOrderTuple;
        d: 'DESC' | 'ASC';
    }
    type SqlOrderPayloadType = SqlOrderDescriptor | FxSqlQuery.OrderSqlStyleTuple[0];
    type SqlGroupByType = string;
    interface SqlFoundRowItem {
        [k: string]: any;
    }
    interface SqlQueryChainDescriptor {
        from?: QueryFromDescriptor[];
        table?: string;
        set?: DataToSet;
        where?: FxSqlQuerySubQuery.SubQueryBuildDescriptor[];
        order?: SqlOrderPayloadType[];
        offset?: number;
        limit?: number;
        found_rows?: SqlFoundRowItem[] | boolean;
        group_by?: SqlGroupByType[];
        where_exists?: boolean;
    }
}
