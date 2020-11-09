var helper = require('../support/spec_helper');
var ORM = require('../../');

describe("Model.count()", function () {
    var db = null;
    var Person = null;

    var setup = function () {
        Person = db.define("person", {
            name: String
        });

        return helper.dropSync(Person, function () {
            Person.createSync([{
                id: 1,
                name: "John Doe"
            }, {
                id: 2,
                name: "Jane Doe"
            }, {
                id: 3,
                name: "John Doe"
            }]);
        });
    };

    before(function () {
        db = helper.connect();
    });

    after(function () {
        return db.closeSync();
    });

    describe("without conditions", function () {
        before(setup);

        it("should return all items in model", function () {
            var count = Person.countSync();
            assert.equal(count, 3);
        });
    });

    describe("with conditions", function () {
        before(setup);

        it("should return only matching items", function () {
            var count = Person.countSync({
                name: "John Doe"
            });
            assert.equal(count, 2);
        });
    });
});