var helper = require('../support/spec_helper');
var ORM = require('../../');

describe("Model.clear()", function () {
    var db = null;
    var Person = null;

    var setup = function () {
        Person = db.define("person", {
            name: String
        });

        ORM.singleton.clear();

        return helper.dropSync(Person, function () {
            Person.createSync([{
                name: "John Doe"
            }, {
                name: "Jane Doe"
            }]);
        });
    };

    before(function () {
        db = helper.connect();
    });

    after(function () {
        db.closeSync();
    });

    describe("with sync", function () {
        before(setup);

        it("should call when done", function () {
            Person.clearSync();

            var count = Person.find().countSync();
            assert.equal(count, 0);
        });
    });

});