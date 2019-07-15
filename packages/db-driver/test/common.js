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
