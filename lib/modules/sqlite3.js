var db = require('db');

function rs_convert(r) {
    var r1 = r.toArray();
    for (var i = 0; i < r1.length; i++)
        r1[i] = r1[i].toJSON();

    return r1;
}

class Database {
    constructor(fname) {
        this.conn = db.openSQLite(fname);
    }

    on(ev) {}

    all(sql, cb) {
        this.conn.execute(sql, function(e, r) {
            if (e)
                return cb(e);
            cb(e, rs_convert(r));
        });
    }

    get(sql, cb) {
        this.all(sql, function(e, r) {
            if (e)
                cb(e);
            cb(e, r[0]);
        });
    }

    execute(sql) {
        return rs_convert(this.conn.execute(sql));
    }

    close() {
        this.conn.close();
    }
}

exports.Database = Database;
