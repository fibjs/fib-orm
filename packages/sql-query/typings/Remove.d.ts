import { FxSqlQuery } from './Typo/Query';
import { FxSqlQueryChainBuilder } from './Typo/Query-ChainBuilder';
import { FxSqlQueryDialect } from './Typo/Dialect';
import { FxSqlQuerySubQuery } from './Typo/SubQuery';
export declare class RemoveQuery implements FxSqlQueryChainBuilder.ChainBuilder__Remove {
    private Dialect;
    private opts;
    private sql;
    constructor(Dialect: FxSqlQueryDialect.Dialect, opts: FxSqlQueryChainBuilder.ChainBuilderOptions);
    from(table: string): this;
    where(...whereConditions: FxSqlQuerySubQuery.SubQueryBuildDescriptor['wheres'][]): this;
    build(): string;
    offset(offset: number): this;
    limit(limit: number): this;
    order(column: string | string[], dir: FxSqlQuery.QueryOrderDirection): this;
}
