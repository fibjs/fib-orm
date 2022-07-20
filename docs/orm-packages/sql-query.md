# `@fxjs/sql-query` <Badge type="warning">WIP</Badge>

[![NPM version](https://img.shields.io/npm/v/@fxjs/sql-query.svg)](https://www.npmjs.org/package/@fxjs/sql-query)&nbsp;
[![NPM download](https://img.shields.io/npm/dt/@fxjs/sql-query.svg)](https://www.npmjs.org/package/@fxjs/sql-query)&nbsp;
[![NPM download monthly](https://img.shields.io/npm/dm/@fxjs/sql-query.svg)](https://www.npmjs.org/package/@fxjs/sql-query)

[DDL]:https://en.wikipedia.org/wiki/Data_definition_language

<!-- SQL Transparent -->
<!-- One-Time Model, Multiple Backend -->

`sql-query`, 用于生成可完成特定操作的 query sql, 是一个纯粹的字符串拼接工具. 它提供的能力可以帮助开发者简化 SQL 流程:

- 基于 `Query` 对象, 对 SQL 语句, SQL Identifier, SQL Value 进行 escape
- 基于 `Query` 对象, 提供了链式构造器(ChainBuilder), 以生成满足基本交互需求的语句
    - `create`: 生成一个 table
    - `select`: 从 table 中查询数据
    - `insert`: 向 table 中插入数据
    - `update`: 更新 table 中的数据
    - `remove`: 按照一定的条件删除 table 中的数据
- `Query` 上的 [knex](./knex.md) 对象, 满足开发者灵活的定制 SQL 需求

支持的数据库 dialect 有:

- `mysql`
- `sqlite`
- `postgresql`

## 快速开始

使用 `sql-query` 以构造用于生成名为 `table1` 表的 SQL.

```js
const { Query }   = require("@fxjs/query");

const query = new Query({ dialect: 'mysql' });

query.create().table('table1').fields({id: 'id', a_text: 'text'}).build()
// => "create table `table1` (`id` int unsigned not null auto_increment primary key, `a_text` text)"
```

## Query

### `new Query::Query(opts: object)`

- `opts.dialect`: (required) 目标数据库类型, 支持 `mysql`, `sqlite`, `postgresql`.
<!-- - `opts.timezone`: (optional) 时区参数, 默认为 `UTC`. -->

### `Query::knex` <Badge type="warning">readonly</Badge>

knex 的实例.

### `Query::Dialect` <Badge type="warning">readonly</Badge>

Dialect 的实例. Dialect 上包含了适用于特定数据库的 escape*, value 转换, 时区转换等功能. 想了解更多关于不同的 Dialect 的信息, 可参考测试用例:

- [mysql](https://github.com/fxjs-modules/orm/blob/@fxjs/sql-query@0.8.1/packages/sql-query/test/integration/test-dialect-mysql.js)
- [sqlite](https://github.com/fxjs-modules/orm/blob/@fxjs/sql-query@0.8.1/packages/sql-query/test/integration/test-dialect-sqlite.js)
- [postgresql](https://github.com/fxjs-modules/orm/blob/@fxjs/sql-query@0.8.1/packages/sql-query/test/integration/test-dialect-postgresql.js)

### `Query::escape(sql, args)`

**signature** `Query::escape(sql: string, values: any[])`

转义 sql 语句中的占位符, 包括:

- `?`, 当作 sql 中的 value 来转义
- `??`, 当作 sql 中的 identifier 来转义

如下, 以 escape mysql 语句为例

```js
const { Query } = require("@fxjs/query");
const query = new Query({ dialect: 'mysql' });

query.escape(`select * from ?? where user_id = ?`, [ 'user', 1 ]);
// => "select * from `user` where user_id = '1'"
```

### `Query::escapeId(...els)`

**signature** `Query::escapeId(...els: (string | number)): string`

将一系列 `eles` 按照 SQL identifier 转义处理后, 输出按照 `.` 聚合的字符串. `eles` 可以是一个字符串, 也可以是一个字符串数组.

```js
const { Query } = require("@fxjs/query");

(new Query({ dialect: 'mysql' })).escapeId('user.id');
// => `user.id`

(new Query({ dialect: 'sqlite' })).escapeId('user.id');
// => `user.id`

(new Query({ dialect: 'postgresql' })).escapeId('user.id');
// => "user"."id"
```

### `Query::escapeVal(val, timezone?)`

**signature** `Query::escapeVal(val: any, timezone?: string): string`

将 `val` 按照 SQL value 转义处理后输出. 根据 `dialect` 的类型不同, 有不同的处理结果.

```js
const { Query } = require("@fxjs/query");

(new Query({ dialect: 'mysql' })).escapeVal(undefined);
// => NULL
(new Query({ dialect: 'mysql' })).escapeVal(123);
// => NULL

(new Query({ dialect: 'sqlite' })).escapeVal(BigInt(12));
// => 12

(new Query({ dialect: 'postgresql' })).escapeVal(NaN);
// => NaN

const d = new Date(1378322111133)
const tzOffsetMillis = (d.getTimezoneOffset() * 60 * 1000)
(new Query({ dialect: 'postgresql' })).escapeVal(new Date(d.getTime() + tzOffsetMillis));
// => 2013-09-04 19:15:11.133
(new Query({ dialect: 'postgresql' })).escapeVal(new Date(d.getTime()), 'Z');
// => '2013-09-04T19:15:11.133Z'
(new Query({ dialect: 'postgresql' })).escapeVal(new Date(d.getTime()), '-0000');
// => '2013-09-04T19:15:11.133Z'
(new Query({ dialect: 'postgresql' })).escapeVal(new Date(d.getTime()), '-0400');
// => '2013-09-04T15:15:11.133Z'
```

关于不同的 dialect 的 `escapeVal` 处理示例, 可参考测试用例:

- [mysql](https://github.com/fxjs-modules/orm/blob/@fxjs/sql-query@0.8.1/packages/sql-query/test/integration/test-dialect-mysql.js)
- [sqlite](https://github.com/fxjs-modules/orm/blob/@fxjs/sql-query@0.8.1/packages/sql-query/test/integration/test-dialect-sqlite.js)
- [postgresql](https://github.com/fxjs-modules/orm/blob/@fxjs/sql-query@0.8.1/packages/sql-query/test/integration/test-dialect-postgresql.js)

**注意** `timezone` 的含义根据不同的数据库, 处理亦有不同, 请参考相关测试用例.

### `Query::create()`

```js
const { Query } = require("@fxjs/query");

const query = new Query({ dialect: 'mysql' });
const chainBuilder = query.create().table('table1');
```

参考[**测试用例**](https://github.com/fxjs-modules/orm/blob/%40fxjs/sql-query%400.8.1/packages/sql-query/test/integration/test-create.js)

### `Query::select()`

```js
const { Query } = require("@fxjs/query");

const query = new Query({ dialect: 'mysql' });
const chainBuilder = query.select();
```

参考[**测试用例**](https://github.com/fxjs-modules/orm/blob/%40fxjs/sql-query%400.8.1/packages/sql-query/test/integration/test-select.js)

### `Query::insert()`

```js
const { Query } = require("@fxjs/query");

const query = new Query({ dialect: 'mysql' });
const chainBuilder = query.insert().table('table1');
```

参考[**测试用例**](https://github.com/fxjs-modules/orm/blob/%40fxjs/sql-query%400.8.1/packages/sql-query/test/integration/test-insert.js)

### `Query::update()`

```js
const { Query } = require("@fxjs/query");

const query = new Query({ dialect: 'mysql' });
const chainBuilder = query.update().table('table1');
```

参考[**测试用例**](https://github.com/fxjs-modules/orm/blob/%40fxjs/sql-query%400.8.1/packages/sql-query/test/integration/test-update.js)

### `Query::remove()`

```js
const { Query } = require("@fxjs/query");

const query = new Query({ dialect: 'mysql' });
const chainBuilder = query.remove();
```

**signature** `Query::remove()`

参考[**测试用例**](https://github.com/fxjs-modules/orm/blob/%40fxjs/sql-query%400.8.1/packages/sql-query/test/integration/test-remove.js)


## comparators

comparators 是在 query 中生成特定比较对象的 utils, 它包含以下比较操作:

- `between`
- `not_between`
- `like`
- `not_like`
- `eq`
- `ne`
- `gt`
- `gte`
- `lt`
- `lte`
- `in`
- `not_in`

(To be continued)