import { FxSqlQueryDialect } from './Typo/Dialect';
import { FxSqlQueryChainBuilder } from './Typo/Query-ChainBuilder';
import { FxSqlQuerySql } from './Typo/Sql';
export declare function build(knexQueryBuilder: import("@fxjs/knex").QueryBuilder, Dialect: FxSqlQueryDialect.Dialect, set: FxSqlQuerySql.DataToSet, opts: FxSqlQueryChainBuilder.ChainBuilderOptions): void;
