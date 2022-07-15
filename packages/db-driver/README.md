## Fibjs Orm Drivers

[![NPM version](https://img.shields.io/npm/v/@fxjs/db-driver.svg)](https://www.npmjs.org/package/@fxjs/db-driver)
[![Build Status](https://travis-ci.org/fxjs-modules/db-driver.svg)](https://travis-ci.org/fxjs-modules/db-driver)
[![Build status](https://ci.appveyor.com/api/projects/status/plarvl262d7279c3?svg=true)](https://ci.appveyor.com/project/richardo2016/db-driver)

## Install

```sh
npm install @fxjs/db-driver
```

## Built-in supported drivers

- MySQL
- SQLite
- Redis

## Support via Adapters

- @fxjs/db-driver-tdengine
- @fxjs/db-driver-elasticsearch
- @fxjs/db-driver-mongodb

## Example

```js
const DbDriver   = require("@fxjs/db-driver");

// use mysql protocol
const driver = new DbDrivers("mysql://username:password@localhost/database");
```
## Test

To test, first make sure you have development dependencies installed. Go to the root folder and do:

```sh
npm install
```

Then, just run the tests.

```sh
npm test
```

If you have a supported database server and want to test against it, first install the module:

And then run:

```sh
URI=mysql://username:password@localhost/database fibjs test/run-db
```