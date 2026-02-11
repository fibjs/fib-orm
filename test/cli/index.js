const { describe, it, before, after } = require('test');
const assert = require('assert');
const Mod = require('../')

describe("fib-orm cli", () => {
    it("basic", () => {
        assert.ok(Mod.default !== null)
    });
});
