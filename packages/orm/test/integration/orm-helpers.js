var test = require("test");
test.setup();

var helper = require('../support/spec_helper');
var ORM = require('../../');

describe("ORM.Helpers", function () {
    var db = null;
    var Person = null;
    var John;

    var setup = function (identityCache) {
        return function () {
            Person = db.define("person", {
                pid: { type: "serial", key: true },
                name: {
                    type: 'text',
                    mapsTo: 'fullname',
                }
            }, {
                identityCache: identityCache
            });

            return helper.dropSync(Person, function () {
                var people = Person.createSync([{
                    name: "John Doe"
                }, {
                    name: "Jane Doe"
                }]);
                John = people[0];
            });
        };
    };

    before(function () {
        db = helper.connect();
    });

    after(function () {
        return db.closeSync();
    });

    it('should has internal property driver.knex', () => {
        assert.exist(db.driver.knex);
        assert.isFunction(db.driver.knex.select);
        assert.isFunction(db.driver.knex.table);
    });

    describe("#pickProperties", function () {
        before(setup(true));

        it("pick serial type", function () {
            const properties = ORM.Helpers.pickProperties(Person, (property) => {
                return property.type === 'serial';
            });

            assert.deepEqual(properties, {
                "pid": {
                  "type": "serial",
                  "key": true,
                  "klass": "primary",
                  "enumerable": true,
                  "mapsTo": "pid",
                  "name": "pid"
                }
            });
        });

        it("pick all text type", function () {
            const properties = ORM.Helpers.pickProperties(Person, (property) => {
                return property.type === 'text';
            });

            assert.deepEqual(properties.name, {
                "type": "text",
                "name": "name",
                "mapsTo": "fullname",
                "enumerable": true,
            });
        });
    });
});

if (require.main === module) {
    test.run(console.DEBUG)
    process.exit()
}