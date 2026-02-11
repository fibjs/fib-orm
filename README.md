## fib-orm

ORM for [fibjs](https://fibjs.org) — a unified ORM package supporting SQLite, MySQL, and PostgreSQL.

### Install

```bash
npm install fib-orm
```

### Quick Start

```js
const ORM = require('fib-orm');

const db = ORM.connectSync('sqlite:test.db');

const User = db.define('user', {
  name: String,
  age: Number
});

db.syncSync();

User.createSync({ name: 'Alice', age: 30 });
const users = User.findSync();
console.log(users);

db.closeSync();
```

### Build

```bash
npm run build
```

### Test

```bash
# SQLite
ORM_PROTOCOL=sqlite fibjs test

# MySQL
ORM_PROTOCOL=mysql fibjs test

# PostgreSQL
ORM_PROTOCOL=postgres fibjs test
```

### License

MIT
