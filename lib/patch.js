var util = require('util');
var url = require('url');

// patch async function to sync function
function patchSync(o, funcs) {
    funcs.forEach(function (func) {
        var old_func = o[func];
        if (old_func) {
            Object.defineProperty(o, func + 'Sync', {
                value: util.sync(old_func),
                writable: true
            });
        }
    })
}

// hook find, patch result
function patchResult(o, funcs) {
    funcs.forEach(function (func) {
        var old_func = o[func];
        if (old_func) {
            var new_func = function () {
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
        assoc.forEach(function (item) {
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
    funcs.forEach(function (func) {
        var old_func = m[func];
        if (old_func)
            m[func] = function () {
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
    m.aggregate = function () {
        var r = aggregate.apply(this, Array.prototype.slice.apply(arguments));
        patchSync(r, ['get']);
        return r;
    };
}

function patchModel(m, opts) {
    var _afterAutoFetch;
    if (opts !== undefined && opts.hooks)
        _afterAutoFetch = opts.hooks.afterAutoFetch;

    m.afterAutoFetch(function (next) {
        patchObject(this);

        if (_afterAutoFetch) {
            if (_afterAutoFetch.length > 0)
                return _afterAutoFetch(next);
            _afterAutoFetch();
        }

        next();
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

function patchInsert(table, data, keyProperties, cb) {
    var q = this.query.insert()
        .into(table)
        .set(data)
        .build();

    this.db.all(q, function (err, info) {
        if (err) return cb(err);
        if (!keyProperties) return cb(null);

        var i, ids = {},
            prop;

        if (keyProperties.length == 1 && keyProperties[0].type == 'serial') {
            ids[keyProperties[0].name] = info.insertId;
            return cb(null, ids);
        } else {
            for (i = 0; i < keyProperties.length; i++) {
                prop = keyProperties[i];
                // Zero is a valid value for an ID column
                ids[prop.name] = data[prop.mapsTo] !== undefined ? data[prop.mapsTo] : null;
            }
            return cb(null, ids);
        }
    }.bind(this));
};

function execQuerySync(query, opt) {
    if (arguments.length == 2)
        query = this.query.escape(query, opt);

    return this.db.execute(query);
}

module.exports = function (orm) {
    var conn = util.sync(orm.connect);
    orm.connectSync = function (opts) {
        if (typeof opts == 'string')
            opts = url.parse(opts, true).toJSON();
        else if (typeof opts == 'object')
            opts = util.clone(opts);

        if (opts.protocol === 'sqlite:' && opts.timezone === undefined)
            opts.timezone = 'UTC';

        var db = conn.call(this, opts);

        patchSync(db, [
            'sync',
            'close',
            'drop',
            'ping'
        ]);

        if (db.driver.dialect === 'sqlite')
            db.driver.insert = patchInsert;

        var def = db.define;
        db.define = function (name, properties, opts) {
            var m = def.call(this, name, properties, opts);
            patchModel(m, opts);
            return m;
        }

        db.begin = function () {
            return this.driver.db.conn.begin();
        };

        db.commit = function () {
            return this.driver.db.conn.commit();
        };

        db.rollback = function () {
            return this.driver.db.conn.rollback();
        };

        db.trans = function (func) {
            return this.driver.db.conn.trans(func);
        };

        db.driver.execQuerySync = execQuerySync;

        return db;
    }

    return orm;
}