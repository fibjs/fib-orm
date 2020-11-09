import type { FxOrmCoreCallbackNS } from "./callback";
import type { FxOrmCoreError } from "./error";
export declare namespace FxOrmCoreSyncNS {
    interface ExposedResult<T = any> {
        error: FxOrmCoreError.ExtendedError;
        result?: T;
    }
    interface SyncCallbackInputArags<T = any> {
        callback?: FxOrmCoreCallbackNS.ExecutionCallback<T>;
        is_sync?: boolean;
    }
}
