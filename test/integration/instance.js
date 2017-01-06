var helper = require('../support/spec_helper');
var ORM = require('../../');

describe("Model instance", function() {
    var db = null;
    var Person = null;

    var setup = function() {
        db.settings.set('instance.returnAllErrors', true);

        Person = db.define("person", {
            name: String,
            age: { type: 'integer', required: false },
            height: { type: 'integer', required: false },
            weight: { type: 'number', required: false, enumerable: true },
            secret: { type: 'text', required: false, enumerable: false },
            data: { type: 'object', required: false }
        }, {
            identityCache: false,
            validations: {
                age: ORM.validators.rangeNumber(0, 150)
            }
        });

        helper.dropSync(Person, function() {
            Person.createSync([{
                name: "Jeremy Doe"
            }, {
                name: "John Doe"
            }, {
                name: "Jane Doe"
            }]);
        });
    };

    before(function() {
        db = helper.connect();
        setup();
    });

    after(function() {
        return db.closeSync();
    });

    describe("#save", function() {
        var main_item, item;

        before(function(done) {
            main_item = db.define("main_item", {
                name: String
            }, {
                auteFetch: true
            });

            item = db.define("item", {
                name: String
            }, {
                identityCache: false
            });

            item.hasOne("main_item", main_item, {
                reverse: "items",
                autoFetch: true
            });

            helper.dropSync([main_item, item], function() {
                var mainItem = main_item.createSync({
                    name: "Main Item"
                });

                var Item = item.createSync({
                    name: "Item"
                });

                var r = mainItem.setItemsSync(Item);
            });
        });

        it("should have a saving state to avoid loops", function() {
            var mainItem = main_item.find({ name: "Main Item" }).firstSync();
            mainItem.saveSync({ name: "new name" });
        });
    });

    xdescribe("#isInstance", function() {
        it("should always return true for instances", function(done) {
            should.equal((new Person).isInstance, true);
            should.equal((Person(4)).isInstance, true);

            Person.find().first(function(err, item) {
                should.not.exist(err);
                should.equal(item.isInstance, true);
                return done();
            });
        });

        it("should be false for all other objects", function() {
            should.notEqual({}.isInstance, true);
            should.notEqual([].isInstance, true);
        });
    });

    xdescribe("#isPersisted", function() {
        it("should return true for persisted instances", function(done) {
            Person.find().first(function(err, item) {
                should.not.exist(err);
                should.equal(item.isPersisted(), true);
                return done();
            });
        });

        it("should return true for shell instances", function() {
            should.equal(Person(4).isPersisted(), true);
        });

        it("should return false for new instances", function() {
            should.equal((new Person).isPersisted(), false);
        });

        it("should be writable for mocking", function() {
            var person = new Person()
            var triggered = false;
            person.isPersisted = function() {
                triggered = true;
            };
            person.isPersisted()
            triggered.should.be.true;
        });
    });

    xdescribe("#set", function() {
        var person = null;
        var data = null;

        function clone(obj) {
            return JSON.parse(JSON.stringify(obj))
        };

        beforeEach(function(done) {
            data = {
                a: {
                    b: {
                        c: 3,
                        d: 4
                    }
                },
                e: 5
            };
            Person.create({ name: 'Dilbert', data: data }, function(err, p) {
                if (err) return done(err);

                person = p;
                done();
            });
        });

        it("should do nothing with flat paths when setting to same value", function() {
            should.equal(person.saved(), true);
            person.set('name', 'Dilbert');
            should.equal(person.name, 'Dilbert');
            should.equal(person.saved(), true);
        });

        it("should mark as dirty with flat paths when setting to different value", function() {
            should.equal(person.saved(), true);
            person.set('name', 'Dogbert');
            should.equal(person.name, 'Dogbert');
            should.equal(person.saved(), false);
            should.equal(person.__opts.changes.join(','), 'name');
        });

        it("should do nothin with deep paths when setting to same value", function() {
            should.equal(person.saved(), true);
            person.set('data.e', 5);

            var expected = clone(data);
            expected.e = 5;

            should.equal(JSON.stringify(person.data), JSON.stringify(expected));
            should.equal(person.saved(), true);
        });

        it("should mark as dirty with deep paths when setting to different value", function() {
            should.equal(person.saved(), true);
            person.set('data.e', 6);

            var expected = clone(data);
            expected.e = 6;

            should.equal(JSON.stringify(person.data), JSON.stringify(expected));
            should.equal(person.saved(), false);
            should.equal(person.__opts.changes.join(','), 'data');
        });

        it("should do nothing with deeper paths when setting to same value", function() {
            should.equal(person.saved(), true);
            person.set('data.a.b.d', 4);

            var expected = clone(data);
            expected.a.b.d = 4;

            should.equal(JSON.stringify(person.data), JSON.stringify(expected));
            should.equal(person.saved(), true);
        });

        it("should mark as dirty with deeper paths when setting to different value", function() {
            should.equal(person.saved(), true);
            person.set('data.a.b.d', 6);

            var expected = clone(data);
            expected.a.b.d = 6;

            should.equal(JSON.stringify(person.data), JSON.stringify(expected));
            should.equal(person.saved(), false);
            should.equal(person.__opts.changes.join(','), 'data');
        });

        it("should mark as dirty with array path when setting to different value", function() {
            should.equal(person.saved(), true);
            person.set(['data', 'a', 'b', 'd'], 6);

            var expected = clone(data);
            expected.a.b.d = 6;

            should.equal(JSON.stringify(person.data), JSON.stringify(expected));
            should.equal(person.saved(), false);
            should.equal(person.__opts.changes.join(','), 'data');
        });

        it("should do nothing with invalid paths", function() {
            should.equal(person.saved(), true);
            person.set('data.a.b.d.y.z', 1);
            person.set('data.y.z', 1);
            person.set('z', 1);
            person.set(4, 1);
            person.set(null, 1);
            person.set(undefined, 1);
            should.equal(person.saved(), true);
        });
    });

    xdescribe("#markAsDirty", function() {
        var person = null;

        beforeEach(function(done) {
            Person.create({ name: 'John', age: 44, data: { a: 1 } }, function(err, p) {
                if (err) return cb(err);

                person = p;
                done();
            });
        });

        it("should mark individual properties as dirty", function() {
            should.equal(person.saved(), true);
            person.markAsDirty('name');
            should.equal(person.saved(), false);
            should.equal(person.__opts.changes.join(','), 'name');
            person.markAsDirty('data');
            should.equal(person.__opts.changes.join(','), 'name,data');
        });
    });

    xdescribe("#dirtyProperties", function() {
        var person = null;

        beforeEach(function(done) {
            Person.create({ name: 'John', age: 44, data: { a: 1 } }, function(err, p) {
                if (err) return cb(err);

                person = p;
                done();
            });
        });

        it("should mark individual properties as dirty", function() {
            should.equal(person.saved(), true);
            person.markAsDirty('name');
            person.markAsDirty('data');
            should.equal(person.saved(), false);
            should.equal(person.dirtyProperties.join(','), 'name,data');
        });
    });

    xdescribe("#isShell", function() {
        it("should return true for shell models", function() {
            should.equal(Person(4).isShell(), true);
        });

        it("should return false for new models", function() {
            should.equal((new Person).isShell(), false);
        });

        it("should return false for existing models", function(done) {
            Person.find().first(function(err, item) {
                should.not.exist(err);
                should.equal(item.isShell(), false);
                return done();
            });
        });
    });

    xdescribe("#validate", function() {
        it("should return validation errors if invalid", function(done) {
            var person = new Person({ age: -1 });

            person.validate(function(err, validationErrors) {
                should.not.exist(err);
                should.equal(Array.isArray(validationErrors), true);

                return done();
            });
        });

        it("should return false if valid", function(done) {
            var person = new Person({ name: 'Janette' });

            person.validate(function(err, validationErrors) {
                should.not.exist(err);
                should.equal(validationErrors, false);

                return done();
            });
        });
    });

    xdescribe("properties", function() {
        xdescribe("Number", function() {
            it("should be saved for valid numbers, using both save & create", function(done) {
                var person1 = new Person({ height: 190 });

                person1.save(function(err) {
                    should.not.exist(err);

                    Person.create({ height: 170 }, function(err, person2) {
                        should.not.exist(err);

                        Person.get(person1[Person.id], function(err, item) {
                            should.not.exist(err);
                            should.equal(item.height, 190);

                            Person.get(person2[Person.id], function(err, item) {
                                should.not.exist(err);
                                should.equal(item.height, 170);
                                done();
                            });
                        });
                    });
                });
            });
        });

        xdescribe("Enumerable", function() {
            it("should not stringify properties marked as not enumerable", function(done) {
                Person.create({ name: 'Dilbert', secret: 'dogbert', weight: 100, data: { data: 3 } }, function(err, p) {
                    if (err) return done(err);

                    var result = JSON.parse(JSON.stringify(p));
                    should.not.exist(result.secret);
                    should.exist(result.weight);
                    should.exist(result.data);
                    should.exist(result.name);

                    done();
                });
            });
        });
    });
});
