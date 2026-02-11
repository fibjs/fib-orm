const { describe, it, before, after } = require('test');
const assert = require('assert');
var helper = require('../support/spec_helper');

describe("hasOne issues", function () {
    var db = null;
    var User = null;
    var Role = null;

    var setup = function (opts) {
        opts = opts || {};
        return function () {
            db.settings.set('instance.identityCache', false);
            db.settings.set('instance.returnAllErrors', true);

            User = db.define('user',{
                name: String,
                role_id: Number
            })
            
            Role = db.define('role',{
                name: String
            })

            User.hasOne('role', Role, { autoFetch: opts.autoFetch })

            helper.dropSync([User, Role], function () {
                var user1 = User.createSync({
                    name: 'test_user1'
                });

                var role1 = Role.createSync({
                    name: 'test_role1'
                });
                var role2 = Role.createSync({
                    name: 'test_role2'
                });

                user1.role = role1;

                user1.saveSync();
            });
        };
    };

    before(function () {
        db = helper.connect();
    });

    after(function () {
        db.closeSync();
    });

    [false, true].forEach(function (autoFetch) {
        describe(`with User.hasOne('role', { autofetch: ${autoFetch} })`, function () {
            before(setup({
                autoFetch: autoFetch
            }));

            it("autofetching", function () {
                var user1 = User.oneSync({ name: 'test_user1' });
                assert.equal(typeof user1.role, autoFetch ? 'object' : 'undefined');
            });
        });
    });

    describe(`save associated items with User.hasOne('role', { autofetch: true })`, function () {
        before(setup({
            autoFetch: true
        }));

        it("should be able to set a new role", function () {
            var user1 = User.oneSync({ name: 'test_user1' });
            assert.equal(user1.role.id, 1);
            assert.equal(user1.role.name, 'test_role1');
    
            user1.role_id = 2;
            user1.saveSync();
    
            user1 = User.oneSync({ name: 'test_user1' });
            assert.equal(user1.role.id, 2);
            assert.equal(user1.role.name, 'test_role2');

            user1.saveSync({ role_id: 1 });
            user1 = User.oneSync({ name: 'test_user1' });
            assert.equal(user1.role.id, 1);
            assert.equal(user1.role.name, 'test_role1');
        });
    });
});