---
home: true
heroImage: /images/cover_photo_symbol.png
heroAlt: Logo image
heroText: ' '
# tagline: Make grateful desktop
# actionText: orm init 🚀!
# actionLink: /clis/orm#init
features:
  - title: 快速开始
    details: 学习成本低, 简单易上手
  - title: TypeScript Powered
    details: 所有模块均采用 TypeScript 开发, 提供类型文件
  - title: Monorepo
    details: 基于 monorepo 风格组织模块包和业务, 代码可重用
editLink: true
footer: ISC Licensed | Copyright © 2018-present FxJS
---

## 快速开始

安装 `@fxjs/orm`:

```sh
npm install @fxjs/orm
```

在你的 fibjs 项目中引入:


```js
var orm = require("@fxjs/orm");

var db = orm.connectSync("mysql://username:password@host/database");
var Person = db.define("person", {
	name      : String,
	surname   : String,
	age       : Number, // FLOAT
	male      : Boolean,
	continent : [ "Europe", "America", "Asia", "Africa", "Australia", "Antartica" ], // ENUM type
	photo     : Buffer, // BLOB/BINARY
	data      : Object // JSON encoded
}, {
	methods: {
		fullName: function () {
			return this.name + ' ' + this.surname;
		}
	},
	validations: {
		age: orm.enforce.ranges.number(18, undefined, "under-age")
	}
});

// 将该表同步到 database
db.syncSync();

// 向 person 表中添加一条数据
Person.createSync({ id: 1, name: "John", surname: "Doe", age: 27 });

// 依据 surname 字段查询所有的 person 记录, 等价于执行 SQL: "SELECT * FROM person WHERE surname = 'Doe'"
var people = Person.findSync({ surname: "Doe" });


console.log("People found: %d", people.length);
console.log("First person: %s, age %d", people[0].fullName(), people[0].age);

// 改变查询到的第一条数据的 age 字段, 并保存同步到数据库
people[0].age = 16;
people[0].saveSync();
```

完整文档, 请参考 [FxJS ORM](/orm/getting-started)