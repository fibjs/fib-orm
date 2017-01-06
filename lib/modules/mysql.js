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
        db.openMySQL(this.opts, function(e, conn) {
            if (!e)
                that.conn = conn;
            cb(e);
        });
    }

    query(sql, cb) {
        this.conn.execute(sql, function(e, r) {
            if (!e) {
                var r1 = r.toArray();
                r1.insertId = r.insertId;
                r1.affected = r.affected;
                for (var i = 0; i < r1.length; i++)
                    r1[i] = r1[i].toJSON();
            }
            cb(e, r1);
        });
    }

    end(cb) {
        this.conn.close(cb);
    }
}

exports.createConnection = function(connOpts) {
    return new Database(connOpts);
};
