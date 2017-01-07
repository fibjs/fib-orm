var util = require('util');

// patch async function to sync function
function patchSync(o, funcs) {
    funcs.forEach(function(func) {
        var old_func = o[func];
        if (old_func) {
            Object.defineProperty(o, func + 'Sync', {
                value: sync(old_func),
                writable: true
            });
        }
    })
}

// hook find, patch result
function patchResult(o, funcs) {
    funcs.forEach(function(func) {
        var old_func = o[func];
        if (old_func) {
            var new_func = function() {
                var rs = old_func.apply(this, Array.prototype.slice.apply(arguments));
                if (rs)
                    patchSync(rs, [
                        "count",
                        "first",
                        "last",
                        'all',
                        'where',
                        'find',
                        'remove',
                        'run'
                    ]);
                return rs;
            }

            if (!old_func.is_new) {
                new_func.is_new = true;
                Object.defineProperty(o, func, {
                    value: new_func,
                    writable: true
                });
            }
        }
    });
}

function patchObject(m) {
    var methods = [
        "save",
        "remove",
        "validate",
        "model"
    ];

    function enum_associations(assoc) {
        assoc.forEach(function(item) {
            if (item.getAccessor)
                methods.push(item.getAccessor);
            if (item.setAccessor)
                methods.push(item.setAccessor);
            if (item.hasAccessor)
                methods.push(item.hasAccessor);
            if (item.delAccessor)
                methods.push(item.delAccessor);
            if (item.addAccessor)
                methods.push(item.addAccessor);
        });
    }

    // patch associations methods
    var opts = m.__opts;
    if (opts) {
        enum_associations(opts.one_associations);
        enum_associations(opts.many_associations);
        enum_associations(opts.extend_associations);
        enum_associations(opts.association_properties);


        for (var f in opts.fieldToPropertyMap) {
            if (opts.fieldToPropertyMap[f].lazyload) {
                var name = f.charAt(0).toUpperCase() + f.slice(1);
                methods.push('get' + name);
                methods.push('set' + name);
                methods.push('remove' + name);
            }
        };
    }

    patchSync(m, methods);
}

function patchHas(m, funcs) {
    funcs.forEach(function(func) {
        var old_func = m[func];
        if (old_func)
            m[func] = function() {
                var r = old_func.apply(this, Array.prototype.slice.apply(arguments));

                var name = arguments[0];
                name = 'findBy' + name.charAt(0).toUpperCase() + name.slice(1);
                patchSync(this, [name]);

                return r;
            }
    })
}

function patchAggregate(m) {
    var aggregate = m.aggregate;
    m.aggregate = function() {
        var r = aggregate.apply(this, Array.prototype.slice.apply(arguments));
        patchSync(r, ['get']);
        return r;
    };
}

function patchModel(m) {
    m.afterAutoFetch(function() {
        patchObject(this);
    });

    patchSync(m, [
        "clear",
        "count",
        "exists",
        "one",
        "where",
        'all',
        'create',
        'drop',
        'find',
        'get',
        'sync'
    ]);

    patchResult(m, [
        'find',
        'all',
        'where'
    ]);

    patchHas(m, [
        'hasOne',
        'extendsTo'
    ]);

    patchAggregate(m);
}

function execQuerySync(query, opt) {
    if (arguments.length == 2)
        query = this.query.escape(query, opt);

    return this.db.execute(query);
}

module.exports = function(orm) {
    var conn = sync(orm.connect);
    orm.connectSync = function() {
        var db = conn.apply(this, Array.prototype.slice.apply(arguments));

        patchSync(db, [
            'sync',
            'close',
            'drop',
            'ping'
        ]);

        var def = db.define;
        db.define = function() {
            var m = def.apply(this, Array.prototype.slice.apply(arguments));
            patchModel(m);
            return m;
        }

        db.driver.execQuerySync = execQuerySync;

        return db;
    }

    return orm;
}
