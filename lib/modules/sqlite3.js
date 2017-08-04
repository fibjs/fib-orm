var db = require('db');

class Database {
    constructor(fname) {
        this.conn = db.openSQLite(fname);
    }

    on(ev) {}

    all(sql, cb) {
        this.conn.execute(sql, cb);
    }

    get(sql, cb) {
        this.all(sql, function (e, r) {
            if (e)
                cb(e);
            cb(e, r[0]);
        });
    }

    execute(sql) {
        return this.conn.execute(sql);
    }

    close() {
        this.conn.close();
    }
}

exports.Database = Database;