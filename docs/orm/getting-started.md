# 开始连接你的数据库

[快速开始]:/

参考首页的[快速开始]

## 概念

简单认识了 orm 连接和操作数据库的能力后, 我们来看一些必要了解的概念

### 同步阻塞 vs 异步非阻塞

| 特征 | blocking style | non-blocking style |
|--|--|--|
| 阻塞进程 | YES | NO |
| 错误处理 | 直接 throw 到上下文 | callback 回调的 `err` 参数 |

在 `@fxjs/orm` 中, 绝大部分和数据库发生交互的 API 同时包含了同步(阻塞)和异步(非阻塞)的版本.

orm 遵循了 fibjs 设计中的约定: 假设某个存在实质上异步行为的 function API 的核心为 `function Xxx(...args: any[], [, cb: (err, ret) => any])`, 则

- 默认 `Xxx` 是 blocking style, 当传入了最后的 cb 函数时, 则 `Xxx` 会变成 non-blocking style
- `function XxxSync(...args: any[])` 一定是 blocking style

我们以 `orm.connect` 这个最常见的 API 为例, 感受一下同一 API 的阻塞和非阻塞版本特征有如下区分:

```js
// blocking/synchronous version
var db = orm.connectSync(uri)
// equivalent to:
var db = orm.connect(uri)

// non-blocking/asynchronous version
orm.connect(uri, (db) => {
    // ...
})
```

在接下来, 你还会看到除了 `orm.connect` 以外的更多具有这种特征的 API, 比如:

```js
var db = orm.connect(uri)

var Person = db.define("person", {
	name      : String,
});

// blocking APIS
var person = Person.find({ where: { name: 'xicilion' } })
var person = Person.findSync({ where: { name: 'xicilion' } })
person.save({ name: 'xicilion', company: 'd3j' })
person.saveSync({ name: 'xicilion', company: 'd3j' })

// non-blocking version
Person.find({ where: { name: 'xicilion' } }, (err, person) => {
    if (err) {
        // ...
    }

    person.save({ name: 'xicilion', company: 'd3j' }, (err, result) => {
        if (err) {
            // ...
        }
    })
})
```