import util    = require("util");
import helpers = require("../Helpers");

import { FxSqlQueryDialect } from "../Typo/Dialect";
import { FxSqlQuery } from "../Typo/Query";
import { FxSqlQuerySql } from "../Typo/Sql";

const DataTypes = {
	id:    'SERIAL PRIMARY KEY',
	int:   'INTEGER',
	float: 'REAL',
	bool:  'SMALLINT',
	text:  'TEXT'
};

const escape = function (
	query: FxSqlQuerySql.SqlFragmentStr,
	args: FxSqlQuerySql.SqlAssignmentValues
) {
	return helpers.escapeQuery(Dialect, query, args);
}

const escapeId = function (...args: ({
	str: string,
	escapes: string[],
} | string)[]) {
	return args.map(function (el): string {
		if (typeof el == "object") {
			return el.str.replace(/\?:(id|value)/g, function (m) {
				if (m == "?:id") {
					return escapeId(el.escapes.shift());
				}
				// ?:value
				return escapeVal(el.escapes.shift());
			});
		}
		return el.split(".").map(function (ele): string { return "\"" + ele.replace(/\"/g, "\"\"") + "\""; }).join(".");
	}).join(".");
};

const escapeVal = function (val: any, timeZone?: FxSqlQuery.FxSqlQueryTimezone): string {
	if (val === undefined || val === null || typeof val === "symbol") {
		return 'NULL';
	}

	if (Array.isArray(val)) {
		if (val.length === 1 && Array.isArray(val[0])) {
			return "(" + val[0].map(escapeVal.bind(this)) + ")";
		}
		return "(" + val.map(escapeVal.bind(this)).join(", ") + ")";
	}

	if (util.isDate(val)) {
		return "'" + helpers.dateToString(val, timeZone || "local", { dialect: 'postgresql' }) + "'";
	}

	if (Buffer.isBuffer(val)) {
		return helpers.bufferToString(val, 'postgresql');
	}

	switch (typeof val) {
		case "number":
			if (!isFinite(val)) {
				val = val.toString();
				break;
			}
			return val.toString();
		case "boolean":
			return val ? "true" : "false";
		case "function":
			return val(exports);
		case "string":
			break;
		case "bigint":
			return val.toString();
		default:
			val = JSON.stringify(val);
	}
	// No need to escape backslashes with default PostgreSQL 9.1+ config.
	// Google 'postgresql standard_conforming_strings' for details.
	return "'" + val.replace(/\'/g, "''") + "'";
};

const defaultValuesStmt = "DEFAULT VALUES";

const Dialect: FxSqlQueryDialect.Dialect = {
	type: 'postgresql' as const,
	DataTypes,
	escape,
	escapeId,
	escapeVal,
	limitAsTop: false,
	knex: null,
	defaultValuesStmt
}

export = Dialect;