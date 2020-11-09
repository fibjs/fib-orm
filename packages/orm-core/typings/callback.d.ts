import type { FxOrmCoreError } from "./error";
export declare namespace FxOrmCoreCallbackNS {
    interface VoidCallback<T_RESULT = any, T_THIS = any> {
        (this: T_THIS, err?: FxOrmCoreError.ExtendedError | null): T_RESULT;
    }
    interface ExecutionCallback<T, T_RESULT = any, T_THIS = any> {
        (this: T_THIS, err?: string | FxOrmCoreError.ExtendedError | FxOrmCoreError.ExtendedError[] | null, result?: T): T_RESULT;
    }
    interface GenericCallback<T, T_RESULT = any, T_THIS = any> {
        (this: T_THIS, err: FxOrmCoreError.ExtendedError | null, result?: T): T_RESULT;
    }
}
