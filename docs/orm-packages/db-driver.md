# `@fxjs/db-driver`

[![NPM version](https://img.shields.io/npm/v/@fxjs/db-driver.svg)](https://www.npmjs.org/package/@fxjs/db-driver)&nbsp;
[![NPM download](https://img.shields.io/npm/dt/@fxjs/db-driver.svg)](https://www.npmjs.org/package/@fxjs/db-driver)&nbsp;
[![NPM download monthly](https://img.shields.io/npm/dm/@fxjs/db-driver.svg)](https://www.npmjs.org/package/@fxjs/db-driver)

db-driver 提供了统一的接口 `Driver`, 用于操作数据库.

## 支持的数据库类型

目前 db-driver 支持的数据库类型有:

| 数据库 | 驱动类型标识 | Driver 类型 |
|--|--|--|
| MySQL/MariaDB | `mysql` | `SQLDriver` `MySQLDriver` |
| PostgreSQL | `postgresql` | `PostgreSQLDriver` |
| SQLite | `sqlite` | `SQLiteDriver` |
| Redis | `redis` | `RedisDriver` |
| MongoDB | `mongodb` | `MongoDBDriver` |

## 快速开始

安装

```sh
npm install @fxjs/db-driver
```

在 fibjs 中构造一个适用于 `mysql` 的 dbdriver

```js
const { Driver } = require('@fxjs/db-driver');

// use connection string
var driver = Driver.create('mysql://root:password@localhost:3306/mydb');
// or use connection object
var driver = Driver.create({
    protocol: 'mysql:',
    hostname: 'localhost',
    username: 'root',
    port: 3306,
    password: 'password',
    database: 'mydb'
});

// open connection
driver.open();

// execute sql query
driver.execute('CREATE DATABASE IF NOT EXISTS mydb');

// close connection
driver.close();
// reopen connection, equivalent to `driver.close()` safely and then `driver.open()`
driver.reopen();
```

## `Driver`

### `Driver.create(connection: string | object): DriverInstance` <Badge type="info">static</Badge>

根据传入数据库连接字符串, 或者数据库连接对象, 创建一个 `Driver` 实例. Driver 会根据传递的前缀, 自动选择对应的数据库类型.

```js
var mydb = Driver.create('mysql://root:@localhost:3306');

var pgdb = Driver.create('psql://root:@localhost:5432');
var pgdb = Driver.create('postgresql://root:@localhost:5432');
var pgdb = Driver.create('pg://root:@localhost:5432');

var redisCmder = Driver.create('redis://127.0.0.1:6379');

var sqliteDB =Driver.create('sqlite:web.db');
var sqliteDB =Driver.create('sqlite:/var/www/web.db');
```

### `Driver.formatUrl(urlObj: object): string` <Badge type="info">static</Badge>

将一个对象格式化为数据库连接字符串.

```js
Driver.formatURL({
    protocol : "mysql:",
    hostname : "localhost",
    username : "root",
    port     : 3306,
    password : "",
    pathname : "/mydb",
    slashes: true // use `//` after protocol
})
// => "mysql://root@localhost:3306/mydb"

Driver.formatURL({
    protocol: "sqlite:",
    pathname: 'web.db',
})
// => "sqlite:web.db"
```


### `Driver.getDriver(type: string): DriverConstructor` <Badge type="info">static</Badge>

根据传入 `type` 获取对应的 driver. `type` 可以是准确的驱动类型 `'mysql' | 'sqlite' | 'psql' | 'mssql' | 'redis' | 'mongodb'`

```js
// return mysql driver
Driver.getDriver('mysql')
```

也可以是带有合法 protocol 前缀的字符串, 比如连接字符串. 当发现传入字符串不是准确的驱动类型时, 会尝试将其按 url 解析, 获得其 protocol 并以此取得对应的驱动类型.

```js
// return mysql driver
Driver.getDriver('mysql://localhost:3306/mydb')
// return sqlite driver
Driver.getDriver('sqlite:web.db')
```

### `Driver::uid` <Badge type="warning">readonly</Badge>

Driver 实例创建时, 生成的唯一 id. 不可更改, 一般用于开发者内部 debug

### `Driver::uri` <Badge type="warning">readonly</Badge>

当前 Driver 经过格式化的连接 uri.

**注意** 格式化后的 uri 更规范, 不一定等于传入的 uri.

### `Driver::type`

当前 Driver 的驱动类型, 参考[驱动类型标识](#支持的数据库类型)

### `Driver::config` <Badge type="warning">readonly</Badge>

当前 Driver 的配置, 该配置是对 `new Driver(options)` 中 `options` 解析后的对象的**快照**.

**P.S.** 这意味着你对 config 上字段的更改是没有意义的.

### `Driver::extend_config` <Badge type="warning">readonly</Badge>

当前 Driver 的扩展配置, 扩展配置**并非**可以自由定义. 

目前, 在创建实例 `new Driver(options)` 时, 会读取 `options.query[ext_conf_key]` 来获取一些 key-value 作为扩展配置.

- `pool`: 是否使用连接池, 默认为 `false`
- `debug`: 是否使用 debug 模式. 根据 query value 进行 coerce, `'0' | 'false' | 'no' | 'n' | '' `表示 `false`, `'1' | 'true'  | 'y'` 或其它非空值表示 `true`.

举例说明: 

```js
// those db.extend_config.pool // => true
var db = Driver.create('mysql://root:@localhost:3306/mydb?pool=1');
var db = Driver.create('mysql://root:@localhost:3306/mydb?pool=aaa');
var db = Driver.create('mysql://root:@localhost:3306/mydb?pool=true');

// those db.extend_config.debug // => true
var db = Driver.create('mysql://root:@localhost:3306/mydb?debug=1');
var db = Driver.create('mysql://root:@localhost:3306/mydb?debug=true');

// those db.extend_config.debug // => false
var db = Driver.create('mysql://root:@localhost:3306/mydb?debug=0');
var db = Driver.create('mysql://root:@localhost:3306/mydb?debug=no');
var db = Driver.create('mysql://root:@localhost:3306/mydb?debug=false');
```

### `Driver::connection` <Badge type="warning">readonly</Badge>

当前 driver 的实际连接对象, 可能是以下类型:

| 驱动类型 | connection 类型 | 是否为 fibjs 原生对象 |
| -- | -- | -- |
| `mysql` | `Class_MySQL` | Y |
| `sqlite` | `Class_SQLite` | Y |
| `postgresql` | `Class_DbConnection` | Y |
| `mongodb` | `Class_MongoDB` | Y |
| `redis` | `Class_Redis` | Y |

### `Driver::isPool` <Badge type="warning">readonly</Badge>

当前 driver 是否使用连接池. 其值取决于 `Driver.extend_config.pool` 的值.

### `Driver::isSql` <Badge type="warning">readonly</Badge>

当前 driver 是否属于 SQL 数据库的客户端, 如 `sqlite`, `mysql`, `postgresql`.

### `Driver::isNoSql` <Badge type="warning">readonly</Badge>

当前 driver 是否属于 NoSQL 数据库的客户端, 如 `mongodb`.

### `Driver::isCommand` <Badge type="warning">readonly</Badge>

当前 driver 是否属于通过 command 方式和 server 交互的客户端, 如 `mongodb`, `redis`.

### `Driver::open(): void`

打开当前 driver 的连接, 打开后, 可以和数据库进行交互. 该方法内部依赖 `Driver::getConnection` 来获取连接对象.

### `Driver::close(): void`

关闭当前 driver 的连接, 关闭后, 不可以和数据库进行交互.

### `Driver::reopen(): void`

**安全地**关闭当前 driver 的连接, 后并重新打开连接.

该方法可以在 driver 未开启时调用

### `Driver::getConnection(): T`

获取一个 driver 驱动类型的连接对象, 

**注意** 该方法的含义并不是「返回 driver 的 connection 对象」, 相对地, 该方法被调用往往是为了给 connection 对象赋值.

### `Driver::connectionPool(callback: (connection: CONN_TYPE) => any): any`

当 `this.isPool` 为真, 会从连接池中获取一个 `connection` 对象, 作为传输传入 `callback` 回调执行;

否则, 则会调用 `this.getConnection()` 获取一个 `connection` 对象, 作为传输传入 `callback` 回调执行.

### `Driver::useTrans(callback: (conn_for_trans: CONN_TYPE) => any)`

获取一个连接 `conn_for_trans`, 以事务的方式执行一个 `callback`.

## `SQLDriver`

**派生关系** `class SQLDriver extends Driver`

`SQLDriver` 是针对 SQL 数据库的 Driver:

db-driver 支持以下 SQL 数据库:

- `MySQLDriver`: `extends SQLDriver`
- `PostgreSQLDriver`: `extends SQLDriver`
- `SQLiteDriver`: `extends SQLDriver`

根据关系型数据库的特点, `SQLDriver` 在 `Driver` 的基础上扩展了接口定义. 并由其派生的子类实现具体的接口.

### `SQLDriver::switchDb(db: name)`

切换当前连接的数据库. 对于部分 SQL 数据库而言该方法没有意义, 比如 SQLite 连接后必然是单库模式.

### `SQLDriver::trans(cb: Function): boolean`

SQL 数据库一般都支持事务(Transaction), 

你也可以使用独立的事务接口, 手动控制事务.

- `SQLDriver::begin()`
- `SQLDriver::commit()`
- `SQLDriver::rollback()`

<!-- 详情参见[事务](../sql-db-transactions) -->

### `SQLDriver::execute(sql: string)` <Badge type="warning">blocking</Badge>

执行 sql 语句, 并返回执行结果.

**注意** 该方法为阻塞方法, 仅支持唯一的参数 `sql`, 因此对 sql 语句的 escape 必须由调用者自行完成.

## `RedisDriver`

**派生关系** `class RedisDriver extends Driver`

### `RedisDriver::command(cmd: string, arg: any)` <Badge type="warning">blocking</Badge>

执行一个 redis cmd(cmd 参数为 arg), 并返回执行结果.

### `RedisDriver::commands(cmds: Record<string, any>, opts: object)` <Badge type="warning">blocking</Badge>

执行一组 redis cmds, 并返回执行结果.

cmds 结构:

```ts
interface IRedisCmds {
    [cmd: string]: /* arg */any
}
```

## `MongoDriver`

**派生关系** `class MongoDriver extends Driver`

### `MongoDriver::command(cmd: string, arg: any)` <Badge type="warning">blocking</Badge>

执行一个 mongodb cmd(cmd 参数为 arg), 并返回执行结果.

### `MongoDriver::commands(cmds: object, opts: object)` <Badge type="warning">blocking</Badge>

执行一组 mongodb cmds, 并返回执行结果.

cmds 结构:

```ts
interface IMongoDBCmds {
    [cmd: string]: /* arg */any
}
```

