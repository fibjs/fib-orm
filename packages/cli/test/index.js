const test = require('test');
test.setup();

const Mod = require('../')

describe("@fxjs/orm-cli", () => {
    it("basic", () => {
        assert.ok(Mod.default !== null)
    });
});

test.run(console.DEBUG);