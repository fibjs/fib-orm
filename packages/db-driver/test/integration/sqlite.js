var common  = require("../common");
var Driver = require("../..").getDriver('sqlite');

xdescribe("SQLite", function () {
	var driver = Driver.create('sqlite:test-driver.db');

	it("#open", () => {
		driver.open()
	})
})