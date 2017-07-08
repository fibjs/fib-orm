var ORM = require('../../');

module.exports.connect = function () {
    return ORM.connectSync("sqlite:test.db");
    // return ORM.connectSync("mysql://root@localhost/test");
};

module.exports.dropSync = function (models, done) {
    if (!Array.isArray(models)) {
        models = [models];
    }

    models.forEach(function (item) {
        item.dropSync();
        item.syncSync();
    });

    if (done)
        done();
};