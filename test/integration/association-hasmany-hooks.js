var helper = require('../support/spec_helper');
var ORM = require('../../');

describe("hasMany hooks", function () {
    var db = null;
    var Person = null;
    var Pet = null;

    var setup = function (props, opts) {
        return function () {
            db.settings.set('instance.identityCache', false);

            Person = db.define('person', {
                name: String,
            });
            Pet = db.define('pet', {
                name: String
            });
            Person.hasMany('pets', Pet, props || {}, opts || {});

            helper.dropSync([Person, Pet]);
        };
    };

    before(function () {
        db = helper.connect();
    });

    after(function () {
        return db.closeSync();
    });

    describe("beforeSave", function () {
        var had_extra = false;

        before(setup({
            born: Date
        }, {
            hooks: {
                beforeSave: function (extra, next) {
                    had_extra = (typeof extra == "object");
                    return next();
                }
            }
        }));

        it("should pass extra data to hook if extra defined", function () {
            var John = Person.createSync({
                name: "John"
            });
            var Deco = Pet.createSync({
                name: "Deco"
            });

            John.addPetsSync(Deco);
            assert.isTrue(had_extra);
        });
    });

    describe("beforeSave", function () {
        var had_extra = false;

        before(setup({}, {
            hooks: {
                beforeSave: function (next) {
                    assert.isFunction(next);
                    return next();
                }
            }
        }));

        it("should not pass extra data to hook if extra defined", function () {
            var John = Person.createSync({
                name: "John"
            });
            var Deco = Pet.createSync({
                name: "Deco"
            });
            John.addPetsSync(Deco);
        });
    });

    describe("beforeSave", function () {
        var had_extra = false;

        before(setup({}, {
            hooks: {
                beforeSave: function (next) {
                    setTimeout(function () {
                        return next(new Error('blocked'));
                    }, 100);
                }
            }
        }));

        it("should block if error returned", function () {
            var John = Person.createSync({
                name: "John"
            });
            var Deco = Pet.createSync({
                name: "Deco"
            });

            try {
                John.addPetsSync(Deco);
            } catch (err) {
                assert.equal(err.message, 'blocked');
            }
        });
    });
});