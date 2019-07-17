const test = require('test')
test.setup()

require('./integration/basic')
require('./integration/sql')

require('./integration/dialect-mysql')
require('./integration/dialect-sqlite')

if (process.env.URI)
    require('./run-db')

test.run(console.DEBUG)