/// <reference types="@fibjs/types" />
import { FxSqlQueryDialect } from "./Typo/Dialect";
import { FxSqlQuery } from "./Typo/Query";
import { FxSqlQueryChainBuilder } from "./Typo/Query-ChainBuilder";
import { FxSqlQuerySql } from "./Typo/Sql";
export declare function escapeQuery(Dialect: FxSqlQueryDialect.Dialect, query: FxSqlQuerySql.SqlFragmentStr, args: FxSqlQuerySql.SqlAssignmentValues): FxSqlQuerySql.SqlFragmentStr;
export declare function dateToString(date: number | Date, timeZone: FxSqlQuery.FxSqlQueryTimezone, opts: FxSqlQueryChainBuilder.ChainBuilderOptions): string;
export declare function zeroPad(number: string | number, n?: number): string;
export declare function get_table_alias(sql: FxSqlQuerySql.SqlQueryChainDescriptor, table: string): string;
export declare function parseTableInputStr(table_name: FxSqlQuerySql.SqlTableInputType): FxSqlQuerySql.SqlTableTuple;
export declare function pickAliasFromFromDescriptor(fd: FxSqlQuerySql.QueryFromDescriptor): string;
export declare function pickColumnAsFromSelectFieldsDescriptor(sitem: FxSqlQuerySql.SqlSelectFieldItemDescriptor): FxSqlQuerySql.SqlSelectFieldItemDescriptor['as'];
export declare function autoIncreatementTableIndex(from: FxSqlQuerySql.SqlQueryChainDescriptor['from']): number;
export declare function defaultTableAliasNameRule(idx: number): string;
export declare const DialectTypes: FxSqlQueryDialect.DialectType[];
export declare function ucfirst(str?: string): string;
export declare function ensureNumber(num: any): any;
export declare function bufferToString(buffer: Class_Buffer | string, dialect: FxSqlQueryDialect.DialectType): string;
export declare function escapeValForKnex(val: any, Dialect: FxSqlQueryDialect.Dialect, opts: FxSqlQueryChainBuilder.ChainBuilderOptions): any;
export declare function cutOffOrderDirectionFromColumnFirstStr(col_name: string): {
    col_name: string;
    direction: FxSqlQuerySql.SqlOrderDescriptor['d'];
};
