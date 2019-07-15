const test = require('test')
test.setup()

require('./integration/basic')

require('./integration/sqlite')
require('./integration/mysql')

// if (process.env.URI)
//     require('./run-db')

test.run(console.DEBUG)