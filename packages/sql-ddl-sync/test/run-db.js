const test = require('test')
test.setup()

var ORM     = require("@fxjs/orm");
var common  = require("./common");
var url     = require("url");

if (!process.env.URI) {
	console.error('no URI provided')
	process.exit(1)
}

var uri = url.parse(process.env.URI, true);

if (!uri.protocol) {
	console.error(
		'invlid URI provided: ',
		process.env.URI
	)
	process.exit(1);
}

ORM.connect(process.env.URI, function (err, db) {
	if (err) throw err;

	common.driver = db.driver;
	common.dialect = db.driver.dialect;

	runTest();

	db.closeSync();

	process.exit(0);
});

function runTest () {
	require('./integration/db')

	test.run(console.DEBUG)
}