import { FxSqlQueryDialect } from "./Typo/Dialect";
import { FxSqlQuerySql } from "./Typo/Sql";
import { FxSqlQueryChainBuilder } from "./Typo/Query-ChainBuilder";
export declare class InsertQuery implements FxSqlQueryChainBuilder.ChainBuilder__Insert {
    private Dialect;
    private opts;
    private sql;
    constructor(Dialect: FxSqlQueryDialect.Dialect, opts: FxSqlQueryChainBuilder.ChainBuilderOptions);
    into(table: string): this;
    set(values: FxSqlQuerySql.DataToSet): this;
    build(): string;
}
