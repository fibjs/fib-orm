const { describe, it, before, after } = require('test');
const assert = require('assert');
require('./integration/basic')
require('./integration/sql')

require('./integration/dialect-mysql')
require('./integration/dialect-sqlite')
require('./integration/dialect-postgresql')

require('./fixtures/property-meta')
require('./features/collection-comment')

if (process.env.URI)
    require('./run-db')
