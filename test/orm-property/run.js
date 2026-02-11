const { describe, it, before, after } = require('test');
const assert = require('assert');
require('./integration/basic')

require('./integration/transformer-mysql')
require('./integration/transformer-sqlite')
require('./integration/transformer-postgresql')
