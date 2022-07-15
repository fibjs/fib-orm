var common      = exports;
var _           = require('lodash');
var util        = require('util');
var querystring = require('querystring');
var Semver      = require('semver');
var ORM         = require('../');

common.ORM = ORM;

/**
 * 
 * @returns {'mysql' | 'sqlite' | 'postgres'}
 */
common.protocol = function () {
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
  var protocol = common.protocol();
  if (common.isTravis()) {
    var config = require("./config.ci")[protocol];
  } else {
    var config = require("./config")[protocol];
  }
  
  if (typeof config == "string") {
    config = require("url").parse(config, protocol);
  }

  if (config.hasOwnProperty("auth")) {
    if (config.auth.indexOf(":") >= 0) {
      config.user = config.auth.substr(0, config.auth.indexOf(":"));
      config.password = config.auth.substr(config.auth.indexOf(":") + 1);
    } else {
      config.user = config.auth;
      config.password = "";
    }
  }
  if (config.hostname) {
    config.host = config.hostname;
  }

  return config;
};

common.getConnectionString = function (opts) {
  var config   = common.getConfig();
  var protocol = common.protocol();
  var query;

  _.defaults(config, {
    user     : { postgres: 'postgres', redshift: 'postgres', mongodb: '' }[protocol] || 'root',
    database : { mongodb:  'test'     }[protocol] || 'orm_test',
    password : '',
    host     : 'localhost',
    pathname : '',
    query    : {}
  });
  _.merge(config, opts || {});

  query = querystring.stringify(config.query);

  switch (protocol) {
    case 'mysql':
    case 'postgres':
    case 'redshift':
    case 'mongodb':
      if (common.isTravis()) {
        if (protocol == 'redshift') protocol = 'postgres';
        return util.format("%s://%s@%s%s/%s?%s",
          protocol, config.user, config.host,
          config.port ? `:${config.port}` : '', config.database, query
        );
      } else {
        return util.format("%s://%s:%s@%s%s/%s?%s",
          protocol, config.user, config.password,
          config.host, config.port ? `:${config.port}` : '', config.database, query
        ).replace(':@','@');
      }
    case 'sqlite':
      var dbname = config.pathname || config.database;
      return util.format("%s://%s?%s", protocol, `${dbname ? `${dbname}.db`: ''}`, query);
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