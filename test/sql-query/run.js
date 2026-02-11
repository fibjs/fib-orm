const { describe, it, before, after } = require('test');
const assert = require('assert');
const fs = require('fs')
const path = require('path')

var options = {};

if (process.env.FILTER) {
	options.include = new RegExp(process.env.FILTER + '.*\\.js$');
}

process.stdout.write("\033[1;34m[i] \033[0;34mTesting \033[1;34msql-query\033[0m\n");

const dir = path.resolve(__dirname, './integration')
fs.readdir(dir).forEach(relpath => {
	const filename = path.resolve(dir, relpath)
	require(filename)
})
