exports.db   = "db_driver_test_db";
exports.table   = "db_driver_test_table";

exports.fakeDriver = {
	query: {
		escapeId  : function (id) {
			return "$$" + id + "$$";
		},
		escapeVal : function (val) {
			return "^^" + val + "^^";
		}
	},
	customTypes: {
		json: {
			datastoreType: function (prop, opts) {
				return prop.type.toUpperCase();
			}
		}
	}
};

function unknownProtocol() {
	return new Error("Unknown protocol - " + exports.driver.type);
}

exports.getKnexInstance = (driver, opts) => {
	var FibKnex  = require("@fxjs/knex");

	var type = driver.type;
	switch (type) {
		default:
			break
		case 'mysql':
			type = 'mysql2'
			break
		case 'psql':
			type = 'pg'
			break
	}

	return FibKnex({
		...opts,
		client: type,
		// useNullAsDefault: true
	})
}