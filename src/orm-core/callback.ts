import type { FxOrmCoreError } from "./error";

export namespace FxOrmCoreCallbackNS {
    export interface VoidCallback<T_RESULT = any, T_THIS = any> {
        (this: T_THIS, err?: FxOrmCoreError.ExtendedError | null): T_RESULT
    }

    export interface ExecutionCallback<T, T_RESULT = any, T_THIS = any> {
        (this: T_THIS, err?: string | FxOrmCoreError.ExtendedError | FxOrmCoreError.ExtendedError[] | null, result?: T): T_RESULT
    }

    export interface GenericCallback<T, T_RESULT = any, T_THIS = any> {
        (this: T_THIS, err: FxOrmCoreError.ExtendedError | null, result?: T): T_RESULT
    }
}