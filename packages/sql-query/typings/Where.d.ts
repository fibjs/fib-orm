import { FxSqlQuerySubQuery } from './Typo/SubQuery';
import { FxSqlQueryDialect } from './Typo/Dialect';
import { FxSqlQueryChainBuilder } from './Typo/Query-ChainBuilder';
export declare function build(knexQueryBuilder: import('@fxjs/knex').QueryBuilder, Dialect: FxSqlQueryDialect.Dialect, whereList: FxSqlQuerySubQuery.SubQueryBuildDescriptor[], opts: FxSqlQueryChainBuilder.ChainBuilderOptions): void;
