import { FxOrmInstance } from "./instance";

export namespace FxOrmError {
    export interface PredefineErrorCodes {
        QUERY_ERROR: number
        NOT_FOUND: number
        NOT_DEFINED: number
        NO_SUPPORT: number
        MISSING_CALLBACK: number
        PARAM_MISMATCH: number
        CONNECTION_LOST: number
        BAD_MODEL: number
    }

    export interface ExtendedError extends Error {
        code?: number | string

        [ext: string]: any
    }

    export interface ValidateError extends FibjsEnforce.ValidationError {
        code?: number | string
    }

    export type ValidateErrorResult = ValidateError | ValidateError[]

    export interface ErrorWaitor {
        evt?: Class_Event,
        err: FxOrmError.ExtendedError
    }

    export interface BatchOperationInstanceErrorItem extends ExtendedError {
        index: number
        instance: FxOrmInstance.Instance
    }
}