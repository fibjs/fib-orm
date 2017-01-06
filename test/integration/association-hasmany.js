var _ = require('lodash');
var helper = require('../support/spec_helper');
var ORM = require('../../');

describe("hasMany", function() {
    var db = null;
    var Person = null;
    var Pet = null;

    before(function() {
        db = helper.connect();
    });

    after(function() {
        db.closeSync();
    });

    describe("normal", function() {

        var setup = function(opts) {
            opts = opts || {};

            return function() {
                db.settings.set('instance.identityCache', false);

                Person = db.define('person', {
                    name: String,
                    surname: String,
                    age: Number
                });
                Pet = db.define('pet', {
                    name: String
                });
                Person.hasMany('pets', Pet, {}, { autoFetch: opts.autoFetchPets });

                helper.dropSync([Person, Pet], function() {
                    Pet.createSync([{ name: "Cat" }, { name: "Dog" }]);

                    /**
                     * John --+---> Deco
                     *        '---> Mutt <----- Jane
                     *
                     * Justin
                     */
                    Person.createSync([{
                        name: "Bob",
                        surname: "Smith",
                        age: 30
                    }, {
                        name: "John",
                        surname: "Doe",
                        age: 20,
                        pets: [{
                            name: "Deco"
                        }, {
                            name: "Mutt"
                        }]
                    }, {
                        name: "Jane",
                        surname: "Doe",
                        age: 16
                    }, {
                        name: "Justin",
                        surname: "Dean",
                        age: 18
                    }]);

                    var people = Person.findSync({ name: "Jane" });
                    var pets = Pet.findSync({ name: "Mutt" });
                    people[0].addPetsSync(pets);
                });
            };
        };

        xdescribe("getAccessor", function() {
            before(setup());

            it("should allow to specify order as string", function() {
                var people = Person.findSync({ name: "John" });

                var pets = people[0].getPetsSync("-name");

                assert.ok(Array.isArray(pets));
                assert.equal(pets.length, 2);
                assert.equal(pets[0].model(), Pet);
                assert.equal(pets[0].name, "Mutt");
                assert.equal(pets[1].name, "Deco");
            });

            it("should return proper instance model", function() {
                var people = Person.findSync({ name: "John" });
                var pets = people[0].getPetsSync("-name");
                assert.equal(pets[0].model(), Pet);
            });

            it("should allow to specify order as Array", function(done) {
                var people = Person.findSync({ name: "John" });

                var pets = people[0].getPetsSync(["name", "Z"]);

                assert.ok(Array.isArray(pets));
                assert.equal(pets.length, 2);
                assert.equal(pets[0].name, "Mutt");
                assert.equal(pets[1].name, "Deco");
            });

            it("should allow to specify a limit", function() {
                var John = Person.find({ name: "John" }).firstSync();

                var pets = John.getPetsSync(1);

                assert.ok(Array.isArray(pets));
                assert.equal(pets.length, 1);
            });

            it("should allow to specify conditions", function() {
                var John = Person.find({ name: "John" }).firstSync();

                var pets = John.getPetsSync({ name: "Mutt" });

                assert.ok(Array.isArray(pets));
                assert.equal(pets.length, 1);
                assert.equal(pets[0].name, "Mutt");
            });

            it("should return a chain if no callback defined", function() {
                var people = Person.findSync({ name: "John" });
                var chain = people[0].getPets({ name: "Mutt" });

                assert.isObject(chain);
                assert.isFunction(chain.find);
                assert.isFunction(chain.only);
                assert.isFunction(chain.limit);
                assert.isFunction(chain.order);
            });

            it("should allow chaining count()", function() {
                var people = Person.findSync({});

                var count = people[1].getPets().countSync();
                assert.strictEqual(count, 2);
                count = people[2].getPets().countSync();
                assert.strictEqual(count, 1);
                count = people[3].getPets().countSync();
                assert.strictEqual(count, 0);
            });
        });

        xdescribe("hasAccessor", function() {
            before(setup());

            it("should return true if instance has associated item", function() {
                var pets = Pet.findSync({ name: "Mutt" });
                var Jane = Person.find({ name: "Jane" }).firstSync();
                var has_pets = Jane.hasPetsSync(pets[0]);
                assert.ok(has_pets);
            });

            xit("should return true if not passing any instance and has associated items", function() {
                var Jane = Person.find({ name: "Jane" }).firstSync();
                var has_pets = Jane.hasPetsSync();
                assert.ok(has_pets);
            });

            it("should return true if all passed instances are associated", function() {
                var pets = Pet.findSync({ name: ["Mutt", "Deco"] });
                var John = Person.find({ name: "John" }).firstSync();
                var has_pets = John.hasPetsSync(pets);
                assert.ok(has_pets);
            });

            it("should return false if any passed instances are not associated", function(done) {
                var pets = Pet.findSync();
                var Jane = Person.find({ name: "Jane" }).firstSync();
                var has_pets = Jane.hasPetsSync(pets);
                assert.notOk(has_pets);
            });

            xit("should return true if join table has duplicate entries", function() {
                var pets = Pet.findSync({ name: ["Mutt", "Deco"] });

                assert.equal(pets.length, 2);

                var John = Person.find({ name: "John" }).firstSync();

                var hasPets = John.hasPetsSync(pets);

                assert.equal(hasPets, true);

                db.driver.execQuery(
                    "INSERT INTO person_pets (person_id, pets_id) VALUES (?,?), (?,?)", [John.id, pets[0].id, John.id, pets[1].id],
                    function(err) {
                        assert.notExist(err);

                        John.hasPets(pets, function(err, hasPets) {
                            assert.equal(err, null);
                            assert.equal(hasPets, true);

                            done()
                        });
                    }
                );
            });
        });

        xdescribe("delAccessor", function() {
            before(setup());

            it("should remove specific associations if passed", function() {
                var pets = Pet.findSync({ name: "Mutt" });
                var people = Person.findSync({ name: "John" });

                people[0].removePetsSync(pets[0]);

                var pets = people[0].getPetsSync();

                assert.ok(Array.isArray(pets));
                assert.equal(pets.length, 1);
                assert.equal(pets[0].name, "Deco");
            });

            it("should remove all associations if none passed", function() {
                var John = Person.find({ name: "John" }).firstSync();

                John.removePetsSync();

                var pets = John.getPetsSync();

                assert.ok(Array.isArray(pets));
                assert.equal(pets.length, 0);
            });
        });

        describe("addAccessor", function() {
            before(setup());

            it("might add duplicates", function() {
                var pets = Pet.findSync({ name: "Mutt" });
                var people = Person.findSync({ name: "Jane" });

                people[0].addPetsSync(pets[0]);

                var pets = people[0].getPetsSync("name");

                assert.ok(Array.isArray(pets));
                assert.equal(pets.length, 2);
                assert.equal(pets[0].name, "Mutt");
                assert.equal(pets[1].name, "Mutt");
            });

            it("should keep associations and add new ones", function() {
                var Deco = Pet.find({ name: "Deco" }).firstSync();
                var Jane = Person.find({ name: "Jane" }).firstSync();

                var janesPets = Jane.getPetsSync();

                var petsAtStart = janesPets.length;

                Jane.addPetsSync(Deco);

                var pets = Jane.getPetsSync("name");

                assert.ok(Array.isArray(pets));
                assert.equal(pets.length, petsAtStart + 1);
                assert.equal(pets[0].name, "Deco");
                assert.equal(pets[1].name, "Mutt");
            });

            it("should accept several arguments as associations", function() {
                var pets = Pet.findSync();
                var Justin = Person.find({ name: "Justin" }).firstSync();
                Justin.addPetsSync(pets[0], pets[1]);

                var pets = Justin.getPetsSync();

                assert.ok(Array.isArray(pets));
                assert.equal(pets.length, 2);
            });

            it("should accept array as list of associations", function() {
                var pets = Pet.createSync([{ name: 'Ruff' }, { name: 'Spotty' }]);
                var Justin = Person.find({ name: "Justin" }).firstSync();

                var justinsPets = Justin.getPetsSync();

                var petCount = justinsPets.length;

                Justin.addPetsSync(pets);

                justinsPets = Justin.getPetsSync();

                assert.ok(Array.isArray(justinsPets));
                // Mongo doesn't like adding duplicates here, so we add new ones.
                assert.equal(justinsPets.length, petCount + 2);
            });

            it("should throw if no items passed", function() {
                var person = Person.oneSync();

                assert.throws(function() {
                    person.addPetsSync();
                });
            });
        });

        xdescribe("setAccessor", function() {
            before(setup());

            it("should accept several arguments as associations", function() {
                var pets = Pet.findSync();
                var Justin = Person.find({ name: "Justin" }).firstSync();

                Justin.setPetsSync(pets[0], pets[1]);

                var pets = Justin.getPetsSync();

                assert.ok(Array.isArray(pets));
                assert.equal(pets.length, 2);
            });

            it("should accept an array of associations", function() {
                var pets = Pet.findSync();
                var Justin = Person.find({ name: "Justin" }).firstSync();

                Justin.setPetsSync(pets);

                var all_pets = Justin.getPetsSync();

                assert.ok(Array.isArray(all_pets));
                assert.equal(all_pets.length, pets.length);
            });

            it("should remove all associations if an empty array is passed", function() {
                var Justin = Person.find({ name: "Justin" }).firstSync();
                var pets = Justin.getPetsSync();
                assert.equal(pets.length, 4);

                Justin.setPetsSync([]);
                var pets = Justin.getPetsSync();
                assert.equal(pets.length, 0);
            });

            it("clears current associations", function() {
                var pets = Pet.findSync({ name: "Deco" });
                var Deco = pets[0];

                var Jane = Person.find({ name: "Jane" }).firstSync();

                var pets = Jane.getPetsSync();

                assert.ok(Array.isArray(pets));
                assert.equal(pets.length, 1);
                assert.equal(pets[0].name, "Mutt");

                Jane.setPetsSync(Deco);

                var pets = Jane.getPetsSync();

                assert.ok(Array.isArray(pets));
                assert.equal(pets.length, 1);
                assert.equal(pets[0].name, Deco.name);
            });
        });

        xdescribe("with autoFetch turned on", function() {
            before(setup({
                autoFetchPets: true
            }));

            it("should fetch associations", function() {
                var John = Person.find({ name: "John" }).firstSync();

                assert.property(John, "pets");
                assert.ok(Array.isArray(John.pets));
                assert.equal(John.pets.length, 2);
            });

            it("should save existing", function() {
                Person.createSync({ name: 'Bishan' });
                var person = Person.oneSync({ name: 'Bishan' });
                person.surname = 'Dominar';
                person.saveSync();
            });

            it("should not auto save associations which were autofetched", function() {
                var pets = Pet.allSync();
                assert.equal(pets.length, 4);

                var paul = Person.createSync({ name: 'Paul' });

                var paul2 = Person.oneSync({ name: 'Paul' });

                assert.equal(paul2.pets.length, 0);

                paul.setPetsSync(pets);

                // reload paul to make sure we have 2 pets
                var paul = Person.oneSync({ name: 'Paul' });
                assert.equal(paul.pets.length, 4);

                // Saving paul2 should NOT auto save associations and hence delete
                // the associations we just created.
                paul2.saveSync();

                // let's check paul - pets should still be associated
                var paul = Person.oneSync({ name: 'Paul' });
                assert.equal(paul.pets.length, 4);
            });

            it("should save associations set by the user", function() {
                var john = Person.oneSync({ name: 'John' });

                assert.equal(john.pets.length, 2);

                john.pets = [];

                john.saveSync();

                // reload john to make sure pets were deleted
                var john = Person.oneSync({ name: 'John' });
                assert.equal(john.pets.length, 0);
            });

        });
    });

    xdescribe("with non-standard keys", function() {
        var Email;
        var Account;

        setup = function(opts) {
            Email = db.define('email', {
                text: { type: 'text', key: true, required: true },
                bounced: Boolean
            });

            Account = db.define('account', {
                name: String
            });

            Account.hasMany('emails', Email, {}, { key: opts.key });

            helper.dropSync([Email, Account]);
        };

        xit("should place ids in the right place", function(done) {
            setup({}, function(err) {
                assert.notExist(err);

                Email.create([{ bounced: true, text: 'a@test.com' }, { bounced: false, text: 'z@test.com' }], function(err, emails) {
                    assert.notExist(err);

                    Account.create({ name: "Stuff" }, function(err, account) {
                        assert.notExist(err);

                        account.addEmails(emails[1], function(err) {
                            assert.notExist(err);

                            db.driver.execQuery("SELECT * FROM account_emails", function(err, data) {
                                assert.notExist(err);

                                assert.equal(data[0].account_id, 1);
                                assert.equal(data[0].emails_text, 'z@test.com');

                                done();
                            });
                        });
                    });
                });
            });
        });

        xit("should generate correct tables", function(done) {
            setup({}, function(err) {
                assert.notExist(err);

                var sql;

                if (protocol == 'sqlite') {
                    sql = "PRAGMA table_info(?)";
                } else {
                    sql = "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = ? ORDER BY data_type";
                }

                db.driver.execQuery(sql, ['account_emails'], function(err, cols) {
                    assert.notExist(err);

                    if (protocol == 'sqlite') {
                        assert.equal(cols[0].name, 'account_id');
                        assert.equal(cols[0].type, 'INTEGER');
                        assert.equal(cols[1].name, 'emails_text');
                        assert.equal(cols[1].type, 'TEXT');
                    } else if (protocol == 'mysql') {
                        assert.equal(cols[0].column_name, 'account_id');
                        assert.equal(cols[0].data_type, 'int');
                        assert.equal(cols[1].column_name, 'emails_text');
                        assert.equal(cols[1].data_type, 'varchar');
                    } else if (protocol == 'postgres') {
                        assert.equal(cols[0].column_name, 'account_id');
                        assert.equal(cols[0].data_type, 'integer');
                        assert.equal(cols[1].column_name, 'emails_text');
                        assert.equal(cols[1].data_type, 'text');
                    }

                    done();
                });
            });
        });

        xit("should add a composite key to the join table if requested", function(done) {
            setup({ key: true }, function(err) {
                assert.notExist(err);
                var sql;

                if (protocol == 'postgres' || protocol === 'redshift') {
                    sql = "" +
                        "SELECT c.column_name, c.data_type " +
                        "FROM  information_schema.table_constraints tc " +
                        "JOIN information_schema.constraint_column_usage AS ccu USING (constraint_schema, constraint_name) " +
                        "JOIN information_schema.columns AS c ON c.table_schema = tc.constraint_schema AND tc.table_name = c.table_name AND ccu.column_name = c.column_name " +
                        "WHERE constraint_type = ? AND tc.table_name = ? " +
                        "ORDER BY column_name";

                    db.driver.execQuery(sql, ['PRIMARY KEY', 'account_emails'], function(err, data) {
                        assert.notExist(err);

                        assert.equal(data.length, 2);
                        assert.equal(data[0].column_name, 'account_id');
                        assert.equal(data[1].column_name, 'emails_text');

                        done()
                    });
                } else if (protocol == 'mysql') {
                    db.driver.execQuery("SHOW KEYS FROM ?? WHERE Key_name = ?", ['account_emails', 'PRIMARY'], function(err, data) {
                        assert.notExist(err);

                        assert.equal(data.length, 2);
                        assert.equal(data[0].Column_name, 'account_id');
                        assert.equal(data[0].Key_name, 'PRIMARY');
                        assert.equal(data[1].Column_name, 'emails_text');
                        assert.equal(data[1].Key_name, 'PRIMARY');

                        done();
                    });
                } else if (protocol == 'sqlite') {
                    db.driver.execQuery("pragma table_info(??)", ['account_emails'], function(err, data) {
                        assert.notExist(err);

                        assert.equal(data.length, 2);
                        assert.equal(data[0].name, 'account_id');
                        assert.equal(data[0].pk, 1);
                        assert.equal(data[1].name, 'emails_text');
                        assert.equal(data[1].pk, 2);

                        done();
                    });
                }
            });
        });
    });
});
