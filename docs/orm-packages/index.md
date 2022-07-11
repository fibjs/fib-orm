# Packages

[`@fxjs/orm`]:https://github.com/fxjs-modules/orm

[`@fxjs/orm`] 的仓库基于 mono repo 的风格管理, 所有的包可以在 https://github.com/fxjs-modules/orm/tree/master/packages 中查看到. 本文简单介绍介绍其中作为 orm 基石的比较重要的包:

[`@fxjs/orm-core`]:https://npmjs.com/package/@fxjs/orm-core
[`@fxjs/db-driver`]:https://npmjs.com/package/@fxjs/db-driver
[`@fxjs/knex`]:https://npmjs.com/package/@fxjs/knex

- [`@fxjs/orm-core`] 核心函数库, 提供了一些用于处理 fibjs 中 blocking/non-blocking 风格转化的 utils 方法, 参考 [这里](./orm-core)
- [`@fxjs/db-driver`] 适配了不同类型 database 的 driver, 支持 SQL/NoSQL/Redis 参考 [这里](./db-driver)
- [`@fxjs/knex`] 为 fibjs 集成好用的 sql generator 库. 参考 [这里](./knex)