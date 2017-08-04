var db = require('db');

class Database {
    constructor(connOpts) {
        this.opts = connOpts;
    }

    on(ev) {}

    ping(cb) {
        setImmediate(cb);
    }

    connect(cb) {
        var that = this;
        db.openMySQL(this.opts, function (e, conn) {
            if (!e)
                that.conn = conn;
            cb(e);
        });
    }

    query(sql, cb) {
        this.conn.execute(sql, cb);
    }

    execute(sql) {
        return this.conn.execute(sql);
    }

    end(cb) {
        this.conn.close(cb);
    }
}

exports.createConnection = function (connOpts) {
    return new Database(connOpts);
};