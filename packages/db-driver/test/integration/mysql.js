require("should");
var common  = require("../common");
var Driver = require("../..").getDriver('mysql');

var driver  = common.fakeDriver;

describe("MySQL.getType", function () {
	it("should detect text", function (done) {
		Driver.getType(null, { mapsTo: 'abc', type: "text" }, driver).value.should.equal("VARCHAR(255)");
		Driver.getType(null, { mapsTo: 'abc', type: "text", size: 150 }, driver).value.should.equal("VARCHAR(150)");
		Driver.getType(null, { mapsTo: 'abc', type: "text", size: 1000 }, driver).value.should.equal("VARCHAR(1000)");

		return done();
	});

	it("should detect numbers", function (done) {
		Driver.getType(null, { mapsTo: 'abc', type: "integer" }, driver).value.should.equal("INTEGER");
		Driver.getType(null, { mapsTo: 'abc', type: "integer", size: 4 }, driver).value.should.equal("INTEGER");
		Driver.getType(null, { mapsTo: 'abc', type: "integer", size: 2 }, driver).value.should.equal("SMALLINT");
		Driver.getType(null, { mapsTo: 'abc', type: "integer", size: 8 }, driver).value.should.equal("BIGINT");
		Driver.getType(null, { mapsTo: 'abc', type: "number", rational: false }, driver).value.should.equal("INTEGER");

		return done();
	});

	it("should detect rational numbers", function (done) {
		Driver.getType(null, { mapsTo: 'abc', type: "number"}, driver).value.should.equal("FLOAT");
		Driver.getType(null, { mapsTo: 'abc', type: "number", size: 4 }, driver).value.should.equal("FLOAT");
		Driver.getType(null, { mapsTo: 'abc', type: "number", size: 8 }, driver).value.should.equal("DOUBLE");

		return done();
	});

	it("should detect booleans", function (done) {
		Driver.getType(null, { mapsTo: 'abc', type: "boolean" }, driver).value.should.equal("TINYINT(1)");

		return done();
	});

	it("should detect dates", function (done) {
		Driver.getType(null, { mapsTo: 'abc', type: "date" }, driver).value.should.equal("DATE");

		return done();
	});

	it("should detect dates with times", function (done) {
		Driver.getType(null, { mapsTo: 'abc', type: "date", time: true }, driver).value.should.equal("DATETIME");
		Driver.getType(null, { mapsTo: 'abc', type: "datetime" }, driver).value.should.equal("DATETIME");

		return done();
	});

	it("should detect binary", function (done) {
		Driver.getType(null, { mapsTo: 'abc', type: "binary" }, driver).value.should.equal("BLOB");

		return done();
	});

	it("should detect big binary", function (done) {
		Driver.getType(null, { mapsTo: 'abc', type: "binary", big: true }, driver).value.should.equal("LONGBLOB");

		return done();
	});

	it("should detect custom types", function (done) {
		Driver.getType(null, { mapsTo: 'abc', type: "json" }, driver).value.should.equal("JSON");

		return done();
	});

	it("should detect required items", function (done) {
		Driver.getType(null, { mapsTo: 'abc', type: "boolean", required: true }, driver).value.should.match(/NOT NULL/);

		return done();
	});

	it("should detect default values", function (done) {
		Driver.getType(null, { mapsTo: 'abc', type: "number", defaultValue: 3 }, driver).value.should.match(/DEFAULT \^\^3\^\^/);

		return done();
	});

	it("should detect serial", function (done) {
		;[
			undefined,
			null,
			0,
			11,
			20
		].forEach(size => {
			var column
			if (size = undefined)
				column = Driver.getType(null, { mapsTo: 'abc', type: "serial" }).value;
			else
				column = Driver.getType(null, { mapsTo: 'abc', type: "serial", size }).value;

			column.should.match(new RegExp(`INT\\\(${size || 11}\\\)`));
			column.should.match(/INT/);
			column.should.match(/NOT NULL/);
			column.should.match(/AUTO_INCREMENT/);
		})
		
		return done();
	});
});
