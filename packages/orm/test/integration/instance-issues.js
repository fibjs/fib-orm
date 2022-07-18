var test = require("test");
test.setup();

var helper = require('../support/spec_helper');
var ORM = require('../../');

describe("Model instance", function () {
    var db = null;
    var Person = null;

    var setup = function () {
        db.settings.set('instance.returnAllErrors', true);

        Person = db.define("person", {
            id: {
                type: 'serial',
            },
            name: String,
            age: {
                type: 'integer',
                required: false
            },
        }, {
            identityCache: false,
            validations: {
                age: ORM.validators.rangeNumber(0, 150)
            }
        });

        helper.dropSync(Person, function () {
            Person.createSync([{
                name: "Jeremy Doe"
            }, {
                name: "John Doe"
            }, {
                name: "Jane Doe"
            }]);
        });
    };

    before(function () {
        db = helper.connect();
        setup();
    });

    after(function () {
        return db.closeSync();
    });

    describe("issues", function () {
        it("set instance field by named accessor", function () {
            var person = Person.find().firstSync();

            assert.equal(person.id, 1);
            assert.equal(person.name, 'Jeremy Doe');

            person.name = 'Jeremy Doe 1';
            person.saveSync();

            var person = Person.find({ id: 1 }).firstSync();
            assert.equal(person.name, 'Jeremy Doe 1');
        });

        it("disallow set serial-type field to another number", function () {
            var person = Person.find().firstSync();
            assert.equal(person.id, 1);

            person.id = 2;

            assert.equal(person.id, 1);
        });

        it("allow set serial-type field to void value", function () {
            var person = Person.find().firstSync();
            assert.equal(person.id, 1);

            person.id = null;
            assert.equal(person.id, null);

            person.id = undefined;
            assert.equal(person.id, undefined);
        });
    })
});

if (require.main === module) {
    test.run(console.DEBUG)
    process.exit()
}