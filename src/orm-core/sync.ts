import type { FxOrmCoreCallbackNS } from "./callback";
import type { FxOrmCoreError } from "./error";

export namespace FxOrmCoreSyncNS {
    export interface ExposedResult<T = any> {
        error: FxOrmCoreError.ExtendedError,
        result?: T
    }

    export interface SyncCallbackInputArags<T = any> {
        callback?: FxOrmCoreCallbackNS.ExecutionCallback<T>,
        is_sync?: boolean
    }
}