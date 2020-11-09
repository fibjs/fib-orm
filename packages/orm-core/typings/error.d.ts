export declare namespace FxOrmCoreError {
    interface ExtendedError extends Error {
        code?: number | string;
        [ext: string]: any;
    }
}
