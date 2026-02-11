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
  hostname : "localhost",
  username : "root",
  // if you use docker in <root>/Dockerfile/docker-compose.yml, 3356, 3357, 3380 are available
  port     : 3306,
  password : "",
  database : "fxjs-orm-test",
  query    : {
    pool   : Boolean(process.env.FX_ORM_TEST_POOL),
  }
};
if (Boolean(process.env.FX_ORM_TEST_DEBUG))
  exports.mysql.query.debug = true;
exports.postgres = {
  protocol : "postgres:",
  hostname : "localhost",
  username : "postgres",
  // if you use docker in <root>/Dockerfile/docker-compose.yml, 5514 are available
  port     : 5432,
  password : "",
  database : "fxjs-orm-test"
};
exports.redshift = {
  protocol : "redshift:",
  hostname : "localhost",
  username : "postgres",
  password : "",
  database : "fxjs-orm-test"
};
exports.mongodb = {
  protocol : "mongodb:",
  hostname : "localhost",
  database : "fxjs-orm-test"
};
exports.sqlite = {
  protocol : "sqlite:",
  database : 'test',
  query    : {
    pool   : Boolean(process.env.FX_ORM_TEST_POOL),
  }
}; // uses in-memory database
if (Boolean(process.env.FX_ORM_TEST_DEBUG))
  exports.mysql.query.debug = true;

exports.dm = {
  protocol : "dm:",
  hostname : "localhost",
  username : "SYSDBA",
  port     : 5236,
  password : "123456789",
  database : "fxjs-orm-test",
  query    : {
    pool   : Boolean(process.env.FX_ORM_TEST_POOL),
  }
};