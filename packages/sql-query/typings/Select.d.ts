import { FxSqlQueryDialect } from './Typo/Dialect';
import { FxSqlQueryChainBuilder } from './Typo/Query-ChainBuilder';
import { FxSqlQuerySql } from './Typo/Sql';
import { FxSqlQuery } from "./Typo/Query";
import { FxSqlQueryHelpler } from './Typo/Helper';
import { FxSqlQuerySubQuery } from "./Typo/SubQuery";
export declare class SelectQuery implements FxSqlQueryChainBuilder.ChainBuilder__Select {
    private opts;
    Dialect: FxSqlQueryDialect.Dialect;
    private sql;
    private _aggregation_functions;
    private fun_stack;
    private get_aggregate_fun;
    constructor(Dialect: FxSqlQueryDialect.Dialect, opts: FxSqlQuery.QueryOptions);
    select(fields?: any): this;
    calculateFoundRows(): this;
    as(_as: string): this;
    fun(fun: string, column?: FxSqlQuerySql.SqlColumnType, _as?: string): this;
    /**
     *
     * @param table from-table
     * @param from_id from-table id(s), align with to_id
     * @param to_table to table
     * @param to_id to-table id(s), align with from_id
     * @param from_opts join descriptor
     */
    from(table: FxSqlQuerySql.SqlTableInputType, from_id?: FxSqlQueryHelpler.Arraiable<string>, to_table?: string, to_id?: FxSqlQueryHelpler.Arraiable<string>, from_opts?: FxSqlQuerySql.QueryFromDescriptorOpts): this;
    where(...whereConditions: (FxSqlQuerySubQuery.SubQueryBuildDescriptor['wheres'] | FxSqlQuerySubQuery.WhereExistsTuple_Flatten[0])[]): this;
    whereExists(table: string, table_link: string, link: FxSqlQuerySql.WhereExistsLinkTuple, cond: FxSqlQuerySubQuery.SubQueryBuildDescriptor['wheres']): this;
    groupBy(...args: FxSqlQuerySql.SqlGroupByType[]): this;
    offset(offset: number): this;
    limit(limit: number): this;
    order(column: FxSqlQuery.OrderNormalizedResult[0], dir?: FxSqlQuery.OrderNormalizedResult[1]): this;
    build(): string;
    abs(...args: any[]): any;
    ceil(...args: any[]): any;
    floor(...args: any[]): any;
    round(...args: any[]): any;
    avg(...args: any[]): any;
    min(...args: any[]): any;
    max(...args: any[]): any;
    log(...args: any[]): any;
    log2(...args: any[]): any;
    log10(...args: any[]): any;
    exp(...args: any[]): any;
    power(...args: any[]): any;
    acos(...args: any[]): any;
    asin(...args: any[]): any;
    atan(...args: any[]): any;
    cos(...args: any[]): any;
    sin(...args: any[]): any;
    tan(...args: any[]): any;
    conv(...args: any[]): any;
    random(...args: any[]): any;
    rand(...args: any[]): any;
    radians(...args: any[]): any;
    degrees(...args: any[]): any;
    sum(...args: any[]): any;
    count(...args: any[]): any;
    distinct(...args: any[]): any;
}
