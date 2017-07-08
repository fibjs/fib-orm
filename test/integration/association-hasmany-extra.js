var helper = require('../support/spec_helper');
var ORM = require('../../');

describe("hasMany extra properties", function () {
    var db = null;
    var Person = null;
    var Pet = null;

    var setup = function (opts) {
        opts = opts || {};
        return function () {
            db.settings.set('instance.identityCache', false);

            Person = db.define('person', {
                name: String,
            }, opts);
            Pet = db.define('pet', {
                name: String
            });
            Person.hasMany('pets', Pet, {
                since: Date,
                data: Object
            });

            return helper.dropSync([Person, Pet]);
        };
    };

    before(function () {
        db = helper.connect();
    });

    after(function () {
        db.closeSync();
    });

    describe("if passed to addAccessor", function () {
        before(setup());

        it("should be added to association", function () {
            var people = Person.createSync([{
                name: "John"
            }]);

            var pets = Pet.createSync([{
                name: "Deco"
            }, {
                name: "Mutt"
            }]);

            var data = {
                adopted: true
            };

            people[0].addPetsSync(pets, {
                since: new Date(),
                data: data
            });

            var John = Person.find({
                name: "John"
            }, {
                autoFetch: true
            }).firstSync();

            assert.property(John, "pets");
            assert.ok(Array.isArray(pets));

            assert.equal(John.pets.length, 2);

            assert.property(John.pets[0], "name");
            assert.property(John.pets[0], "extra");
            assert.isObject(John.pets[0].extra);
            assert.property(John.pets[0].extra, "since");
            assert.ok(John.pets[0].extra.since instanceof Date);

            assert.equal(typeof John.pets[0].extra.data, 'object');
            assert.equal(JSON.stringify(data), JSON.stringify(John.pets[0].extra.data));
        });
    });
});