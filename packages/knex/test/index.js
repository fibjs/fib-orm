const test = require('test')
test.setup()

require('./sqlite')
require('./mysql')
require('./postgresql')

test.run(console.DEBUG)