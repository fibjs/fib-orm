var db = require('db');

class Database {
    constructor(fname) {
        this.conn = db.openSQLite(fname);
    }

    on(ev) {}

    all(sql, cb) {
        this.conn.execute(sql, function(e, r) {
            var r1;
            if (!e) {
                r1 = r.toArray();
                for (var i = 0; i < r1.length; i++)
                    r1[i] = r1[i].toJSON();
            }
            cb(e, r1);
        });
    }

    get(sql, cb) {
        this.all(sql, function(e, r) {
            if (e)
                cb(e);
            cb(e, r[0]);
        });
    }

    close() {
        this.conn.close();
    }
}

exports.Database = Database;
