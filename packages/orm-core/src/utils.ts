import type { FxOrmCoreCallbackNS } from "./callback";
import type { FxOrmCoreError } from "./error";
import type { FxOrmCoreSyncNS } from "./sync";

export function exposeErrAndResultFromSyncMethod<T = any> (
	exec: Function,
	args?: any[],
	opts?: {
		thisArg?: any,
	}
): FxOrmCoreSyncNS.ExposedResult<T> {
	let error: FxOrmCoreError.ExtendedError,
		result: T

	const { thisArg = null } = opts || {};

	try {
		result = exec.apply(thisArg, args);
	} catch (ex) {
		error = ex
	}

	return { error, result }
}

export function throwErrOrCallabckErrResult <RESULT_T = any> (
	input: FxOrmCoreSyncNS.ExposedResult<RESULT_T>,
	opts?: {
		no_throw?: boolean
		callback?: FxOrmCoreCallbackNS.ExecutionCallback<any, RESULT_T>,
		use_tick?: boolean
	}
): void {
	const {
		use_tick = false,
		callback = null,
	} = opts || {}

	const { no_throw = false } = opts || {};

	if (!no_throw && input.error)
		throw input.error;

	if (typeof callback === 'function')
		if (use_tick)
			process.nextTick(() => {
				callback(input.error, input.result);
			});
		else
			callback(input.error, input.result);
}