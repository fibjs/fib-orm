/// <reference types="@fibjs/types" />

/// <reference path="error.d.ts" />
/// <reference path="callback.d.ts" />

declare namespace FxOrmCoreNS {
    interface ExposedResult<T = any> {
        error: FxOrmCoreError.ExtendedError,
        result?: T
    }

    interface SyncCallbackInputArags<T = any> {
        callback?: FxOrmCoreCallbackNS.ExecutionCallback<T>,
        is_sync?: boolean
    }
    
    interface ExportModule {
        Utils: {
            exposeErrAndResultFromSyncMethod<T = any> (
                exec: Function,
                args?: any[],
                opts?: {
                    thisArg?: any,
                }
            ): FxOrmCoreNS.ExposedResult<T>

            throwErrOrCallabckErrResult<RESULT_T = any> (
                input: FxOrmCoreNS.ExposedResult<RESULT_T>,
                opts?: {
                    no_throw?: boolean
                    callback?: FxOrmCoreCallbackNS.ExecutionCallback<any, RESULT_T>,
                    use_tick?: boolean
                }
            ): void
        }
    }
}

declare module "@fxjs/orm-core" {
    var mod: FxOrmCoreNS.ExportModule
    export = mod
}