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
import type { FxOrmCoreCallbackNS } from "./callback";
import type { FxOrmCoreSyncNS } from "./sync";

export function catchBlocking<T = any> (
	executor: Function,
	args?: any[],
	opts?: {
		thisArg?: any,
	}
): FxOrmCoreSyncNS.ExposedResult<T> {
	let error: FxOrmCoreError.ExtendedError,
		result: T

	const { thisArg = null } = opts || {};

	try {
		result = executor.apply(thisArg, args);
	} catch (ex) {
		error = ex
	}

	return { error, result }
}

export function takeAwayResult <RESULT_T = any> (
	input: FxOrmCoreSyncNS.ExposedResult<RESULT_T>,
	opts?: {
		callback?: FxOrmCoreCallbackNS.ExecutionCallback<any, RESULT_T>,
		use_tick?: boolean
		no_throw?: boolean
	}
): void {
	const {
		use_tick = false,
		callback = null,
	} = opts || {}

	const isFunc = typeof callback === 'function';

	const { no_throw = isFunc } = opts || {};

	if (!no_throw && input.error)
		throw input.error;

	if (isFunc)
		if (use_tick)
			process.nextTick(() => {
				callback(input.error, input.result);
			});
		else
			callback(input.error, input.result);
}