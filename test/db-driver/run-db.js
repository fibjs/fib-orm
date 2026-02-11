const { describe, it, before, after } = require('test');
const assert = require('assert');
var ORM     = require("../../lib/db-driver/orm");
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
	require('./integration/db.callback')
	require('./integration/db')

}