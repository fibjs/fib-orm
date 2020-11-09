export namespace FxOrmCoreError {
    export interface ExtendedError extends Error {
        code?: number | string

        [ext: string]: any
    }

    // type ValidateErrorResult = ValidateError | ValidateError[]

    // interface ErrorWaitor {
    //     evt?: Class_Event,
    //     err: FxOrmError.ExtendedError
    // }

    // interface BatchOperationInstanceErrorItem extends ExtendedError {
    //     index: number
    //     instance: FxOrmInstance.Instance
    // }
}