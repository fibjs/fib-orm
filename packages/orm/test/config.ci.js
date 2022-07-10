// To fxjs-orm-test, rename this file to config.js and update
// the following configuration
//
// To run a single driver, go to root folder and do (mysql example):
// ORM_PROTOCOL=mysql fibjs test/run
//
// To run all drivers:
// make test

exports.mysql = {
  protocol : "mysql:",
  host      : "localhost",
  user     : "root",
  port     : 3306,
  password : "",
  database : "fxjs-orm-test",
  query    : {
    pool     : Boolean(process.env.FX_ORM_TEST_POOL),
  }
};
if (Boolean(process.env.FX_ORM_TEST_DEBUG))
  exports.mysql.query.debug = true;
exports.postgres = {
  protocol : "postgres:",
  host      : "localhost",
  user     : "root",
  password : "",
  database : "fxjs-orm-test"
};
exports.redshift = {
  protocol  : "redshift:",
  host      : "localhost",
  user      : "root",
  password  : "",
  database  : "fxjs-orm-test"
};
exports.mongodb = {
  protocol  : "mongodb:",
  host      : "localhost",
  database  : "fxjs-orm-test"
};
exports.sqlite = {
  protocol  : "sqlite:",
  database  : 'test',
  query    : {
    pool     : Boolean(process.env.FX_ORM_TEST_POOL),
  }
}; // uses in-memory database
if (Boolean(process.env.FX_ORM_TEST_DEBUG))
  exports.mysql.query.debug = true;