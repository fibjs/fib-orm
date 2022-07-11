export declare namespace FxOrmCoreError {
    interface ExtendedError extends Error {
        code?: number | string;
        [ext: string]: any;
    }
}
import type { FxOrmCoreCallbackNS } from "./callback";
import type { FxOrmCoreSyncNS } from "./sync";
export declare function catchBlocking<T = any>(executor: Function, args?: any[], opts?: {
    thisArg?: any;
}): FxOrmCoreSyncNS.ExposedResult<T>;
export declare function takeAwayResult<RESULT_T = any>(input: FxOrmCoreSyncNS.ExposedResult<RESULT_T>, opts?: {
    callback?: FxOrmCoreCallbackNS.ExecutionCallback<any, RESULT_T>;
    use_tick?: boolean;
    no_throw?: boolean;
}): void;
