import type { FxSqlQuerySql } from '@fxjs/sql-query';
import type { FxOrmAssociation } from '../../Typo/assoc';
import type { FxOrmDMLDriver } from '../../Typo/DMLDriver';
import type { FxOrmQuery } from '../../Typo/query';
import type { FxOrmCommon } from '../../Typo/_common';
export declare function execQuery<T = any>(this: FxOrmDMLDriver.DMLDriver): T;
export declare function eagerQuery<T = any>(this: FxOrmDMLDriver.DMLDriver, association: FxOrmAssociation.InstanceAssociationItem, opts: FxOrmQuery.ChainFindOptions, keys: string[], cb: FxOrmCommon.ExecutionCallback<T>): T;
export declare const poolQuery: FxOrmDMLDriver.DMLDriver['poolQuery'];
export declare function execQuerySync(this: FxOrmDMLDriver.DMLDriver, query: string, opt: FxSqlQuerySql.SqlEscapeArgType[]): any;
