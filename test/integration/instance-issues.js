const { describe, it, before, after } = require('test');
const assert = require('assert');
var helper = require('../support/spec_helper');
var ORM = require('../../');

describe("Model instance issues", function () {
    var db = null;
    var Person = null;

    var setup = function () {
        db.settings.set('instance.returnAllErrors', true);

        Person = db.define("person_issues", {
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
            var person = Person.find({}, { order: 'id' }).firstSync();

            assert.equal(person.id, 1);
            assert.equal(person.name, 'Jeremy Doe');

            person.name = 'Jeremy Doe 1';
            person.saveSync();

            var person = Person.find({ id: 1 }).firstSync();
            assert.equal(person.name, 'Jeremy Doe 1');
        });

        it("disallow set serial-type field to another number", function () {
            var person = Person.find({}, { order: 'id' }).firstSync();
            assert.strictEqual(person.id, 1);

            person.id = 2;

            assert.strictEqual(person.id, 1);
        });

        it("allow set serial-type field to void value", function () {
            var person = Person.find({}, { order: 'id' }).firstSync();
            assert.strictEqual(person.id, 1);

            person.id = null;
            assert.strictEqual(person.id, null);

            person.id = undefined;
            assert.strictEqual(person.id, undefined);
        });
    })
});
