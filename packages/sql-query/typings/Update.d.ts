import { FxSqlQuerySql } from "./Typo/Sql";
import { FxSqlQuery } from "./Typo/Query";
import { FxSqlQueryDialect } from "./Typo/Dialect";
import { FxSqlQuerySubQuery } from "./Typo/SubQuery";
import { FxSqlQueryChainBuilder } from "./Typo/Query-ChainBuilder";
export declare class UpdateQuery implements FxSqlQueryChainBuilder.ChainBuilder__Update {
    private Dialect;
    private opts;
    private sql;
    constructor(Dialect: FxSqlQueryDialect.Dialect, opts: FxSqlQuery.QueryOptions);
    into(table: string): this;
    set(values: FxSqlQuerySql.DataToSet): this;
    where(...whereConditions: FxSqlQuerySubQuery.SubQueryBuildDescriptor['wheres'][]): this;
    build(): string;
}
