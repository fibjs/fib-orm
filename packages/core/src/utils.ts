export const exposeErrAndResultFromSyncMethod: FxOrmCoreNS.ExportModule['Utils']['exposeErrAndResultFromSyncMethod'] = function<T = any> (
	exec: Function,
	args: any[] = [],
	opts?: {
		thisArg?: any,
	}
): FxOrmCoreNS.ExposedResult<T> {
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

export const throwErrOrCallabckErrResult: FxOrmCoreNS.ExportModule['Utils']['throwErrOrCallabckErrResult'] = function<RESULT_T = any> (
	input: FxOrmCoreNS.ExposedResult<RESULT_T>,
	opts?: {
		no_throw?: boolean
		callback?: FxOrmCoreCallbackNS.ExecutionCallback<any, RESULT_T>,
		use_tick?: boolean
	}
) {

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