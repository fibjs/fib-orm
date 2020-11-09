import type { FxOrmCoreCallbackNS } from "./callback";
import type { FxOrmCoreSyncNS } from "./sync";
export declare function exposeErrAndResultFromSyncMethod<T = any>(exec: Function, args?: any[], opts?: {
    thisArg?: any;
}): FxOrmCoreSyncNS.ExposedResult<T>;
export declare function throwErrOrCallabckErrResult<RESULT_T = any>(input: FxOrmCoreSyncNS.ExposedResult<RESULT_T>, opts?: {
    no_throw?: boolean;
    callback?: FxOrmCoreCallbackNS.ExecutionCallback<any, RESULT_T>;
    use_tick?: boolean;
}): void;
