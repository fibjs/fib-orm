var common      = exports;
var _           = require('lodash');
var util        = require('util');
var url         = require('url');
var querystring = require('querystring');
var Semver      = require('semver');
var ORM         = require('../');

common.ORM = ORM;

/**
 * 
 * @returns {'mysql' | 'sqlite' | 'postgres'}
 */
common.dbType = function () {
  const orig = (process.env.ORM_PROTOCOL || '').toLocaleLowerCase();
  switch (orig) {
    case 'postgresql':
    case 'postgres':
    case 'psql':
    case 'pg':
      return 'postgres';
    default:
      return orig;
  }
};

common.isTravis = function() {
  return Boolean(process.env.CI);
};

common.createConnection = function(opts, cb) {
  return ORM.connect(this.getConnectionString(opts), cb);
};

common.hasConfig = function (proto) {
  var config;

  if (common.isTravis()) return 'found';

  try {
    config = require("./config");
  } catch (ex) {
    return 'not-found';
  }

  return (config.hasOwnProperty(proto) ? 'found' : 'not-defined');
};

/**
 * @typedef {import('./config.ci')} ITestConfig
 * @returns {ITestConfig[keyof ITestConfig]}
 */
common.getConfig = function () {
  var dbType = common.dbType();
  if (common.isTravis()) {
    var config = require("./config.ci")[dbType];
  } else {
    var config = require("./config")[dbType];
  }
  
  if (typeof config == "string") {
    config = url.parse(config, !!dbType);
  }

  return config;
};

common.getConnectionString = function (opts) {
  var config   = common.getConfig();
  var dbType = common.dbType();

  _.defaults(config, {
    username : { postgres: 'postgres', redshift: 'postgres', mongodb: '' }[dbType] || 'root',
    database : { mongodb:  'test'     }[dbType] || 'orm_test',
    password : '',
    hostname : 'localhost',
    pathname : '',
    query    : {}
  });
  _.merge(config, opts || {});

  switch (dbType) {
    case 'mysql':
    case 'postgres':
    case 'redshift':
    case 'mongodb':
      if (common.isTravis()) {
        if (dbType == 'redshift') dbType = 'postgres';
      }

      return url.format({
        protocol: `${dbType}:`,
        username: config.username,
        password: config.password,
        hostname: config.hostname,
        port: config.port,
        pathname: !config.database ? '' : `/${config.database}`,
        query: config.query,
        slashes: true,
      });
    case 'sqlite':
      var dbname = config.database;
      return url.format({
        protocol: 'sqlite:',
        slashes: false,
        pathname: `${dbname ? `${dbname}.db`: ''}`,
        query: config.query
      });
    default:
      throw new Error("Unknown protocol " + protocol);
  }
};

common.retry = function (before, run, until, done, args) {
  if (typeof until === "number") {
    var countDown = until;
    until = function (err) {
      if (err && --countDown > 0) return false;
      return true;
    };
  }

  if (typeof args === "undefined") args = [];

  var handler = function (err) {
    if (until(err)) return done.apply(this, arguments);
    return runNext();
  };

  args.push(handler);

  var runCurrent = function () {
    if (run.length == args.length) {
      return run.apply(this, args);
    } else {
      run.apply(this, args);
      handler();
    }
  };

  var runNext = function () {
    try {
      if (before.length > 0) {
        before(function (err) {
          if (until(err)) return done(err);
          return runCurrent();
        });
      } else {
        before();
        runCurrent();
      }
    }
    catch (e) {
      handler(e);
    }
  };

  if (before.length > 0) {
    before(function (err) {
      if (err) return done(err);
      runNext();
    });
  } else {
    before();
    runNext();
  }
};

common.nodeVersion = function () {
  return new Semver(process.versions.node);
}