const { describe, it, before, after } = require('test');
const assert = require('assert');
require('./integration/basic')

require('./integration/sqlite')
require('./integration/mysql')
require('./integration/postgresql')
require('./integration/redis')
require('./integration/mongodb')

// if (process.env.URI)
//     require('./run-db')
