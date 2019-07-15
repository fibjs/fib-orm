var common  = require("../common");
var Driver = require("../..").getDriver('sqlite');

describe("Redis", function () {
	describe("basic operation", () => {
		var driver = Driver.create('redis://127.0.0.1:6379');

		it("#open, #ping, #close, re-open", () => {
			driver.open()

			driver.ping()

			driver.close()
		});

		it('#command', () => {
			driver.reopen()

			assert.deepEqual(
				driver.command("set", "test", "aaa").toString(),
				"OK"
			);
			
			assert.deepEqual(
				driver.command("get", "test").toString(),
				"aaa"
			);

			assert.deepEqual(
				driver.command("exists", "test"),
				1
			);

			assert.deepEqual(
				driver.command("type", "test").toString(),
				"string"
			);
		});

		it('#commands', () => {
			driver.reopen()

			const resuls = driver.commands({
				"set": ["test", "aaa"],
				"get": "test",
				"exists": "test",
				"type": "test",
			});

			assert.deepEqual(resuls[0].result.toString(), "OK")
			assert.deepEqual(resuls[1].result.toString(), "aaa")
			assert.deepEqual(resuls[2].result, 1)
			assert.deepEqual(resuls[3].result.toString(), "string")
		});
	})
})