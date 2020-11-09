/// <reference types="@fxjs/sql-ddl-sync" />

import { FxOrmCoreError } from "@fxjs/orm-core"

import { FxOrmError } from "./Error";

export namespace FxOrmCommon {
    export type IdType = string | number
    export type Arraible<T> = T | T[]
    
    export interface VoidCallback<T_RESULT = any, T_THIS = any> {
        (this: T_THIS, err?: FxOrmCoreError.ExtendedError | null): T_RESULT
    }

    export interface ExecutionCallback<T, T_RESULT = any, T_THIS = any> {
        (this: T_THIS, err?: string | FxOrmError.ExtendedError | FxOrmError.ExtendedError[] | null, result?: T): T_RESULT
    }

    export interface GenericCallback<T, T_RESULT = any, T_THIS = any> {
        (this: T_THIS, err: FxOrmError.ExtendedError | null, result?: T): T_RESULT
    }

    export interface NextCallback<ERR_T = string, T_RESULT = any, T_THIS = any> {
        (this: T_THIS, err?: ERR_T): T_RESULT
    }

    export interface SuccessCallback<T> {
        (result?: T): any
    }

    export interface ValidatorCallback {
        (errors: Error[]): void
    }

    export type Nilable<T> = null | T

    export interface ExposedResult<T = any> {
        error: FxOrmError.ExtendedError,
        result?: T
    }

    export interface SyncCallbackInputArags<T = any> {
        callback?: ExecutionCallback<T>,
        is_sync?: boolean
    }

    export interface ValueWaitor<T = any> {
        evt?: Class_Event,
        value: T
    }
}