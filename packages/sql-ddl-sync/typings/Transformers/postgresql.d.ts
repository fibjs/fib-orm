/// <reference types="@fibjs/types" />
import { FxOrmSqlDDLSync } from "../Typo/_common";
declare type ITransformers = FxOrmSqlDDLSync.Transformers<Class_DbConnection>;
export declare const columnInfo2Property: ITransformers['columnInfo2Property'];
export declare const property2ColumnType: ITransformers['property2ColumnType'];
export {};
