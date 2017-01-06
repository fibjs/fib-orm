var url = require('url');

module.exports = {
    parse: function(u, q) {
        var o = url.parse(u, q).toJSON();
        if (q)
            o.query = o.query.toJSON();
        return o;
    }
}
