var ORM = require('../../');
var helper = require('../support/spec_helper');

describe("hasOne", function () {
    var db = null;
    var Person = null;
    var Pet = null;

    var setup = function () {
        return function () {
            Person = db.define('person', {
                name: String
            });
            Pet = db.define('pet', {
                name: String
            });
            Person.hasOne('pet', Pet, {
                reverse: 'owners',
                field: 'pet_id'
            });

            helper.dropSync([Person, Pet], function () {
                // Running in series because in-memory sqlite encounters problems
                Person.createSync({
                    name: "John Doe"
                });
                Person.createSync({
                    name: "Jane Doe"
                });
                Pet.createSync({
                    name: "Deco"
                });
                Pet.createSync({
                    name: "Fido"
                });
            });
        };
    };

    before(function () {
        db = helper.connect();
    });

    after(function () {
        return db.closeSync();
    });

    describe("reverse", function () {
        var removeHookRun = false;

        before(setup({
            hooks: {
                beforeRemove: function () {
                    removeHookRun = true;
                }
            }
        }));

        it("should create methods in both models", function () {
            var person = Person(1);
            var pet = Pet(1);

            assert.isFunction(person.getPet);
            assert.isFunction(person.setPet);
            assert.isFunction(person.removePet);
            assert.isFunction(person.hasPet);

            assert.isFunction(pet.getOwners);
            assert.isFunction(pet.setOwners);
            assert.isFunction(pet.hasOwners);
        });

        describe(".getAccessor()", function () {
            it("should work", function () {
                var John = Person.find({
                    name: "John Doe"
                }).firstSync();
                var Deco = Pet.find({
                    name: "Deco"
                }).firstSync();
                var has_owner = Deco.hasOwnersSync();
                assert.isFalse(has_owner);

                Deco.setOwnersSync(John);

                var JohnCopy = Deco.getOwnersSync();
                assert.ok(Array.isArray(JohnCopy));
                assert.deepEqual(John, JohnCopy[0]);
            });

            describe("Chain", function () {
                before(function () {
                    var petParams = [{
                            name: "Hippo"
                        },
                        {
                            name: "Finch",
                            owners: [{
                                name: "Harold"
                            }, {
                                name: "Hagar"
                            }]
                        },
                        {
                            name: "Fox",
                            owners: [{
                                name: "Nelly"
                            }, {
                                name: "Narnia"
                            }]
                        }
                    ];

                    var pets = Pet.createSync(petParams);
                    assert.equal(pets.length, 3);

                    var people = Person.findSync({
                        name: ["Harold", "Hagar", "Nelly", "Narnia"]
                    });
                    assert.exist(people);
                    assert.equal(people.length, 4);
                });

                it("should be returned if no callback is passed", function () {
                    var pet = Pet.oneSync();
                    assert.exist(pet);

                    var chain = pet.getOwners();

                    assert.equal(typeof chain, 'object');
                    assert.equal(typeof chain.run, 'function');
                });

                it(".remove() should not call hooks", function () {
                    var pet = Pet.oneSync({
                        name: "Finch"
                    });
                    assert.exist(pet);

                    assert.equal(removeHookRun, false);
                    pet.getOwners().removeSync();
                    assert.equal(removeHookRun, false);

                    var items = Person.findSync({
                        name: "Harold"
                    });
                    assert.equal(items.length, 0);
                });

            });
        });

        it("should be able to set an array of people as the owner", function () {
            var owners = Person.findSync({
                name: ["John Doe", "Jane Doe"]
            });

            var Fido = Pet.find({
                name: "Fido"
            }).firstSync();

            var has_owner = Fido.hasOwnersSync();
            assert.isFalse(has_owner);

            Fido.setOwnersSync(owners);

            var ownersCopy = Fido.getOwnersSync();
            assert.ok(Array.isArray(owners));
            assert.equal(owners.length, 2);

            // Don't know which order they'll be in.
            var idProp = 'id'

            if (owners[0][idProp] == ownersCopy[0][idProp]) {
                assert.deepEqual(owners[0], ownersCopy[0]);
                assert.deepEqual(owners[1], ownersCopy[1]);
            } else {
                assert.deepEqual(owners[0], ownersCopy[1]);
                assert.deepEqual(owners[1], ownersCopy[0]);
            }

        });

        // broken in mongo
        describe("findBy()", function () {
            before(setup());

            before(function () {
                var jane = Person.oneSync({
                    name: "Jane Doe"
                });
                var deco = Pet.oneSync({
                    name: "Deco"
                });
                deco.setOwnersSync(jane);
            });

            it("should throw if no conditions passed", function () {
                assert.throws(function () {
                    Pet.findByOwners(function () {});
                });
            });

            it("should lookup reverse Model based on associated model properties", function () {
                var pets = Pet.findByOwnersSync({
                    name: "Jane Doe"
                });
                assert.equal(Array.isArray(pets), true);
            });

            it("should return a ChainFind if no callback passed", function () {
                var ChainFind = Pet.findByOwners({
                    name: "John Doe"
                });
                assert.isFunction(ChainFind.run);
            });
        });
    });

    xdescribe("reverse find", function () {
        it("should be able to find given an association id", function () {
            common.retry(setup(), function () {
                Person.find({
                    name: "John Doe"
                }).first(function (err, John) {
                    assert.notExist(err);
                    assert.exist(John);
                    Pet.find({
                        name: "Deco"
                    }).first(function (err, Deco) {
                        assert.notExist(err);
                        assert.exist(Deco);
                        Deco.hasOwners(function (err, has_owner) {
                            assert.notExist(err);
                            assert.isFalse(has_owner);

                            Deco.setOwners(John, function (err) {
                                assert.notExist(err);

                                Person.find({
                                    pet_id: Deco[Pet.id[0]]
                                }).first(function (err, owner) {
                                    assert.notExist(err);
                                    assert.exist(owner);
                                    assert.equal(owner.name, John.name);
                                    done();
                                });

                            });
                        });
                    });
                });
            }, 3);
        });

        xit("should be able to find given an association instance", function () {
            common.retry(setup(), function () {
                Person.find({
                    name: "John Doe"
                }).first(function (err, John) {
                    assert.notExist(err);
                    assert.exist(John);
                    Pet.find({
                        name: "Deco"
                    }).first(function (err, Deco) {
                        assert.notExist(err);
                        assert.exist(Deco);
                        Deco.hasOwners(function (err, has_owner) {
                            assert.notExist(err);
                            assert.isFalse(has_owner);

                            Deco.setOwners(John, function (err) {
                                assert.notExist(err);

                                Person.find({
                                    pet: Deco
                                }).first(function (err, owner) {
                                    assert.notExist(err);
                                    assert.exist(owner);
                                    assert.equal(owner.name, John.name);
                                    done();
                                });

                            });
                        });
                    });
                });
            }, 3);
        });

        xit("should be able to find given a number of association instances with a single primary key", function () {
            common.retry(setup(), function () {
                Person.find({
                    name: "John Doe"
                }).first(function (err, John) {
                    assert.notExist(err);
                    assert.exist(John);
                    Pet.all(function (err, pets) {
                        assert.notExist(err);
                        assert.exist(pets);
                        assert.equal(pets.length, 2);

                        pets[0].hasOwners(function (err, has_owner) {
                            assert.notExist(err);
                            assert.isFalse(has_owner);

                            pets[0].setOwners(John, function (err) {
                                assert.notExist(err);

                                Person.find({
                                    pet: pets
                                }, function (err, owners) {
                                    assert.notExist(err);
                                    assert.exist(owners);
                                    assert.equal(owners.length, 1);

                                    assert.equal(owners[0].name, John.name);
                                    done();
                                });
                            });
                        });
                    });
                });
            }, 3);
        });
    });
});