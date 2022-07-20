/// <reference lib="es2017" />
import { CreateQuery } from "./Create";
import { SelectQuery } from "./Select";
import { InsertQuery } from "./Insert";
import { UpdateQuery } from "./Update";
import { RemoveQuery } from "./Remove";
export import Helpers = require('./Helpers');
export import Dialects = require('./Dialects');
import { FxSqlQuery } from './Typo/Query';
import { FxSqlQueryDialect } from './Typo/Dialect';
export declare const comparators: import("./Typo").FxSqlQueryComparator.ComparatorHash;
export declare const Text: FxSqlQuery.TypedQueryObjectWrapper<"text">;
export declare class Query implements FxSqlQuery.Class_Query {
    readonly Dialect: FxSqlQueryDialect.Dialect;
    readonly knex: FxSqlQuery.Class_Query['knex'];
    private opts;
    private _fns;
    private _proxyFn;
    constructor(_opts?: string | FxSqlQuery.QueryOptions);
    escape: FxSqlQueryDialect.Dialect['escape'];
    escapeId: FxSqlQueryDialect.Dialect['escapeId'];
    escapeVal: FxSqlQueryDialect.Dialect['escapeVal'];
    create(): CreateQuery;
    select(): SelectQuery;
    insert(): InsertQuery;
    update(): UpdateQuery;
    remove(): RemoveQuery;
}
export * from './Typo/index';
