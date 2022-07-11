# ORM Core

## 错误处理

orm core 提供了一些用于处理 fibjs 中 blocking/non-blocking API 下错误的 utils

- `catchBlocking` / `Utils.exposeErrAndResultFromSyncMethod`
- `takeAwayResult` / `Utils.throwErrOrCallabckErrResult`

其使用场景可以参考其[测试用例](https://github.com/fxjs-modules/orm/blob/00116a2b9a6c32269a6980ffd19a878d1bc36080/packages/core/test/integration/utils.js),

在 orm 中, blocking 或 non-blocking 风格执行函数都可能存在错误:

```js
// blocking-style
try {
    result = orm.connect(uri)
} catch (error) {}

// non-blocking-style
orm.connect(url, (error, result) => {
    // ...
})
```

关于 block/non-blocking 对 error 的处理方式, 参考[同步阻塞 vs 异步非阻塞](../orm/getting-started.md#同步阻塞-vs-异步非阻塞)

无论哪种风格, 都涉及到两个对象 `error` 和 `result`, 可以总结为 `ExposedResult` 结构

```ts
interface ExposedResult<T = any> {
    error: FxOrmCoreError.ExtendedError,
    result?: T
}
```

### catchBlocking

执行一个 `execution` 过程, 并 catch 其中可能抛出的错误

```ts
function catchBlocking<T = any> (
	execution: Function,
	args?: any[],
	opts?: {
		thisArg?: any,
	}
): FxOrmCoreSyncNS.ExposedResult<T>
```

### takeAwayResult

如果 `opts.callback` 是方法, 使用 `opts.callback` 回调处理 `input: ExposedResult` 对象, 且不抛出错误; 否则, 当 `input.error` 非空时将其抛出.

```ts
function takeAwayResult<RESULT_T = any>(input: FxOrmCoreSyncNS.ExposedResult<RESULT_T>, opts?: {
    callback?: FxOrmCoreCallbackNS.ExecutionCallback<any, RESULT_T>;
    no_throw?: boolean;
    use_tick?: boolean;
}): void;
```

该方法常常用于帮助实现本质上包含异步操作, 且在同时具有 blocking / non-blocking 风格的函数. 在函数内部, 若 `input.error` 不为空, `takeAwayResult` 会根据 `callback` 是否为方法做出不同的处理:
1. 如果 `callback` 是一个方法, 则**不** throw `input.error`, 而是交由 `callback` 回调
1. 否则, 则直接 throw `input.error`

开发者也可以通过手动指定 `no_throw` 的值, 来强制是否 throw `input.error`.