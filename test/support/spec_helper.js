var ORM = require('../../');

module.exports.connect = function () {
    return ORM.connectSync(require('./conn'));
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