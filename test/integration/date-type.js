var helper = require('../support/spec_helper');
var ORM = require('../../');
var util = require('util');

describe("Date Type", function () {
    var db = null;
    var Person = null;

    var setup = function (hooks) {
        return function () {
            Person = db.define("person", {
                name: {
                    type: "text",
                    required: true
                },
                birthday: Date
            });

            return helper.dropSync(Person);
        };
    };

    before(function () {
        db = helper.connect();
    });

    after(function () {
        return db.closeSync();
    });

    describe("opt", function () {
        before(setup());

        it("insert", function () {
            var John = Person.createSync({
                name: "John Doe",
                birthday: '1971-08-28T00:00:00Z'
            });

            var who = Person.oneSync({
                name: "John Doe"
            });

            assert.equal(who.birthday.getTime(),
                new Date('1971-08-28T00:00:00Z').getTime());
        });

        it("update", function () {
            var John = Person.oneSync({
                name: "John Doe"
            });

            John.birthday = '1971-08-29T00:00:00Z';
            John.saveSync();

            var who = Person.oneSync({
                name: "John Doe"
            });

            assert.equal(who.birthday.getTime(),
                new Date('1971-08-29T00:00:00Z').getTime());
        });

        it("find", function () {
            var who = Person.oneSync({
                birthday: '1971-08-29T00:00:00Z'
            });

            assert.equal(who.name, 'John Doe');
        });
    });
});