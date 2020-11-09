import { FxSqlQueryDialect } from "./Dialect";
import { FxSqlQueryChainBuilder } from "./Query-ChainBuilder";
import { FxSqlQuerySql } from './Sql';
export declare namespace FxSqlQuery {
    type OrderNormalizedTuple = [string | string[], "Z" | "A"];
    type OrderSqlStyleTuple = [FxSqlQuerySql.SqlFragmentStr, FxSqlQuerySql.SqlAssignmentValues?];
    type OrderNormalizedResult = OrderNormalizedTuple | OrderSqlStyleTuple;
    interface QueryOptions {
        dialect?: FxSqlQueryDialect.DialectType;
        timezone?: FxSqlQueryTimezone;
    }
    type QueryOrderDirection = 'Z' | 'A' | string;
    type FxSqlQueryTimezone = 'Z' | 'local' | string;
    interface TypedQueryObject<T = 'text' | string, TD = any> {
        data: TD;
        type(): T;
    }
    interface TypedQueryObjectWrapper<T = 'text' | string, TD = any> {
        (data: TD): FxSqlQuery.TypedQueryObject<T, TD>;
    }
    class Class_Query {
        constructor(_opts?: string | FxSqlQuery.QueryOptions);
        readonly knex: FxSqlQueryDialect.Dialect['knex'];
        Dialect: FxSqlQueryDialect.Dialect;
        escape: FxSqlQueryDialect.Dialect['escape'];
        escapeId: FxSqlQueryDialect.Dialect['escapeId'];
        escapeVal: FxSqlQueryDialect.Dialect['escapeVal'];
        create(): FxSqlQueryChainBuilder.ChainBuilder__Create;
        select(): FxSqlQueryChainBuilder.ChainBuilder__Select;
        insert(): FxSqlQueryChainBuilder.ChainBuilder__Insert;
        update(): FxSqlQueryChainBuilder.ChainBuilder__Update;
        remove(): FxSqlQueryChainBuilder.ChainBuilder__Remove;
    }
}
