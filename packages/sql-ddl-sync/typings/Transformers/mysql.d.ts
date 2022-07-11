/// <reference types="@fibjs/types" />
import { FxOrmSqlDDLSync } from "../Typo/_common";
declare type ITransformers = FxOrmSqlDDLSync.Transformers<Class_MySQL>;
export declare const columnInfo2Property: ITransformers['columnInfo2Property'];
export declare const property2ColumnType: ITransformers['property2ColumnType'];
export declare const buffer2ColumnsMeta: ITransformers['buffer2ColumnsMeta'];
export {};
