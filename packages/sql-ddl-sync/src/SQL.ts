/// <reference path="../@types/index.d.ts" />

import { getDialect } from './Utils';

export function CREATE_TABLE (
	options: FxOrmSqlDDLSync__SQL.TableOptions,
	db_type: FxDbDriverNS.DriverType,
) {
	var sql = "CREATE TABLE " + getDialect(db_type).escapeId(options.name) + " (" + options.columns.join(", ");

	if (options.keys && options.keys.length > 0) {
		sql += ", PRIMARY KEY (" + options.keys.map(function (val) {
			return getDialect(db_type).escapeId(val);
		}).join(", ") + ")";
	}

	sql += ")";

	return sql;
};

export function DROP_TABLE (
	options: FxOrmSqlDDLSync__SQL.TableOptions,
	db_type: FxDbDriverNS.DriverType,
) {
	var sql = "DROP TABLE " + getDialect(db_type).escapeId(options.name);

	return sql;
};

export function ALTER_TABLE_ADD_COLUMN (
	options: FxOrmSqlDDLSync__SQL.AddColumnOptions,
	db_type: FxDbDriverNS.DriverType,
) {
	var sql = "ALTER TABLE " + getDialect(db_type).escapeId(options.name) +
	          " ADD " + options.column;

	if (options.after) {
		sql += " AFTER " + getDialect(db_type).escapeId(options.after);
	} else if (options.first) {
		sql += " FIRST";
	}

	return sql;
};

export function ALTER_TABLE_RENAME_COLUMN (
	opts: FxOrmSqlDDLSync__SQL.AlertColumnRenameOptions,
	db_type: FxDbDriverNS.DriverType,
) {
	var eid = getDialect(db_type).escapeId;
	var sql = "ALTER TABLE "	+ eid(opts.name) +
	          " RENAME COLUMN " + eid(opts.oldColName) + " TO " + eid(opts.newColName);

  return sql;
}

export function ALTER_TABLE_MODIFY_COLUMN (
	options: FxOrmSqlDDLSync__SQL.AlterColumnOptions,
	db_type: FxDbDriverNS.DriverType,
) {
	var sql = "ALTER TABLE " + getDialect(db_type).escapeId(options.name) +
	          " MODIFY " + options.column;
			  
	return sql;
};

export function ALTER_TABLE_DROP_COLUMN (
	options: FxOrmSqlDDLSync__SQL.AlterColumnOptions,
	db_type: FxDbDriverNS.DriverType,
) {
	var sql = "ALTER TABLE " + getDialect(db_type).escapeId(options.name) +
	          " DROP " + getDialect(db_type).escapeId(options.column);

	return sql;
};

export function CREATE_INDEX (
	options: FxOrmSqlDDLSync__SQL.IndexOptions,
	db_type: FxDbDriverNS.DriverType,
) {
	var sql = "CREATE" + (options.unique ? " UNIQUE" : "") + " INDEX " + getDialect(db_type).escapeId(options.name) +
	          " ON " + getDialect(db_type).escapeId(options.collection) +
	          " (" + options.columns.map(function (col) { return getDialect(db_type).escapeId(col); }) + ")";
	
	return sql;
};

export function DROP_INDEX (
	options: FxOrmSqlDDLSync__SQL.IndexOptions,
	db_type: FxDbDriverNS.DriverType,
) {
	var sql = "DROP INDEX " + getDialect(db_type).escapeId(options.name) +
	          " ON " + getDialect(db_type).escapeId(options.collection);

	return sql;
};

// export function RENAME_TABLE (options, driver: FxOrmSqlDDLSync__Driver.Driver) {
//  var sql = "ALTER TABLE " + options.oldCollectionName + " RENAME TO " + options.newCollectionName + " ;";
// }
