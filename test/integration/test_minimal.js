const { describe, it, before, after } = require('test');
const assert = require('assert');
const common = require('../common');
const sqlDDLSync = require('../../lib/sql-ddl-sync');
const { Driver: DBDriver } = require("../../lib/db-driver");

console.log('describe available:', typeof describe);

describe('Simple test', function() {
    it('should work', function() {
        assert.ok(true);
    });
});
