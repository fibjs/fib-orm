import FxORMCore = require("@fxjs/orm-core");
import SQL = require("../SQL");

// @see https://www.sqlite.org/lang_altertable.html
export const hasCollectionSync: FxOrmSqlDDLSync__Dialect.Dialect['hasCollectionSync'] = function (
	driver, name
) {
	const rows = driver.execQuery("SELECT * FROM sqlite_master WHERE type = 'table' and name = ?", [name])

	return rows.length > 0;
};

export const hasCollection: FxOrmSqlDDLSync__Dialect.Dialect['hasCollection'] = function (
	driver, name, cb
) {
	const exposedErrResults = FxORMCore.Utils.exposeErrAndResultFromSyncMethod(
		() => hasCollectionSync(driver, name)
	)
	FxORMCore.Utils.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: true, callback: cb });
};

export const addPrimaryKeySync: FxOrmSqlDDLSync__Dialect.Dialect['addPrimaryKeySync'] = function (
	driver, tableName, columnName
) {
	const sql = "ALTER TABLE ?? ADD CONSTRAINT ?? PRIMARY KEY(??);";
	return driver.execQuery(sql, [tableName, columnName + "PK", columnName]);
};

export const addPrimaryKey: FxOrmSqlDDLSync__Dialect.Dialect['addPrimaryKey'] = function (
	driver, tableName, columnName, cb
) {
	const exposedErrResults = FxORMCore.Utils.exposeErrAndResultFromSyncMethod(
		() => addPrimaryKeySync(driver, tableName, columnName)
	)
	FxORMCore.Utils.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: true, callback: cb });
};

export const dropPrimaryKeySync: FxOrmSqlDDLSync__Dialect.Dialect['dropPrimaryKeySync'] = function (
	driver, tableName, columnName
) {
	const sql = "ALTER TABLE ?? DROP CONSTRAINT ??;"
	return driver.execQuery(sql, [tableName, columnName + "PK"]);
};

export const dropPrimaryKey: FxOrmSqlDDLSync__Dialect.Dialect['dropPrimaryKey'] = function (
	driver, tableName, columnName, cb
) {
	const exposedErrResults = FxORMCore.Utils.exposeErrAndResultFromSyncMethod(
		() => dropPrimaryKeySync(driver, tableName, columnName)
	)
	FxORMCore.Utils.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: true, callback: cb });
};

export const addForeignKeySync: FxOrmSqlDDLSync__Dialect.Dialect['addForeignKeySync'] = function (
	driver, tableName, options
) {
	const sql = "ALTER TABLE ?? ADD FOREIGN KEY(??) REFERENCES ??(??);";
	return driver.execQuery(sql, [tableName, options.name, options.references.table, options.references.column]);
};

export const addForeignKey: FxOrmSqlDDLSync__Dialect.Dialect['addForeignKey'] = function (
	driver, tableName, options, cb
) {
	const exposedErrResults = FxORMCore.Utils.exposeErrAndResultFromSyncMethod(
		() => addForeignKeySync(driver, tableName, options)
	)
	FxORMCore.Utils.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: true, callback: cb });
};

export const dropForeignKeySync: FxOrmSqlDDLSync__Dialect.Dialect['dropForeignKeySync'] = function (
	driver, tableName, columnName
) {
	const sql = "ALTER TABLE ?? DROP CONSTRAINT ??;"
	return driver.execQuery(sql, [tableName, tableName + "_" + columnName + "_fkey"]);
};

export const dropForeignKey: FxOrmSqlDDLSync__Dialect.Dialect['dropForeignKey'] = function (
	driver, tableName, columnName, cb
) {
	const exposedErrResults = FxORMCore.Utils.exposeErrAndResultFromSyncMethod(
		() => dropForeignKeySync(driver, tableName, columnName)
	)
	FxORMCore.Utils.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: true, callback: cb });
};

export const getCollectionPropertiesSync: FxOrmSqlDDLSync__Dialect.Dialect['getCollectionPropertiesSync'] = function (
	driver, name
) {
	const cols = driver.execQuery("PRAGMA table_info(??)", [name]);
	let columns = <{ [col: string]: FxOrmSqlDDLSync__Column.PropertySQLite }>{}, m;

	for (let i = 0; i < cols.length; i++) {
		const column = <FxOrmSqlDDLSync__Column.PropertySQLite>{};
		const dCol = cols[i];

		if (dCol.pk) {
			column.key = true;
		}

		if (dCol.notnull) {
			column.required = true;
		}
		if (dCol.dflt_value) {
			m = dCol.dflt_value.match(/^'(.*)'$/);
			if (m) {
				column.defaultValue = m[1];
			} else {
				column.defaultValue = m[0];
			}
		}

		switch (dCol.type.toUpperCase()) {
			case "INTEGER":
				// In sqlite land, integer primary keys are autoincrement by default
				// weather you asked for this behaviour or not.
				// http://www.sqlite.org/faq.html#q1
				if (dCol.pk == 1) {
					column.type = "serial";
				} else {
					column.type = "integer";
				}
				break;
			case "INTEGER UNSIGNED":
				column.type = "boolean";
				break;
			case "REAL":
				column.type = "number";
				column.rational = true;
				break;
			case "DATETIME":
				column.type = "date";
				column.time = true;
				break;
			case "BLOB":
				column.type = "binary";
				column.big = true;
				break;
			case "TEXT":
				column.type = "text";
				break;
			default:
				throw new Error("Unknown column type '" + dCol.type + "'");
		}

		columns[dCol.name] = column;
	}

	driver.execQuery("PRAGMA table_info(??)", [name]);

	return columns;
};

export const getCollectionProperties: FxOrmSqlDDLSync__Dialect.Dialect['getCollectionProperties'] = function (
	driver, name, cb
) {
	const exposedErrResults = FxORMCore.Utils.exposeErrAndResultFromSyncMethod(
		() => getCollectionPropertiesSync(driver, name)
	)
	FxORMCore.Utils.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: true, callback: cb });
};

export const createCollectionSync: FxOrmSqlDDLSync__Dialect.Dialect['createCollectionSync'] = function (
	driver, name, columns, keys
) {
	return driver.execQuery(SQL.CREATE_TABLE({
		name: name,
		columns: columns,
		keys: keys
	}, driver));
};

export const createCollection: FxOrmSqlDDLSync__Dialect.Dialect['createCollection'] = function (
	driver, name, columns, keys, cb
) {
	const exposedErrResults = FxORMCore.Utils.exposeErrAndResultFromSyncMethod(
		() => createCollectionSync(driver, name, columns, keys)
	)
	FxORMCore.Utils.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: true, callback: cb });
};

export const dropCollectionSync: FxOrmSqlDDLSync__Dialect.Dialect['dropCollectionSync'] = function (
	driver, name
) {
	return driver.execQuery(SQL.DROP_TABLE({ name: name }, driver));
};

export const dropCollection: FxOrmSqlDDLSync__Dialect.Dialect['dropCollection'] = function (
	driver, name, cb
) {
	const exposedErrResults = FxORMCore.Utils.exposeErrAndResultFromSyncMethod(
		() => dropCollectionSync(driver, name)
	)
	FxORMCore.Utils.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: true, callback: cb });
};

export const addCollectionColumnSync: FxOrmSqlDDLSync__Dialect.Dialect['addCollectionColumnSync'] = function (
	driver, name, column, after_column
) {
	return driver.execQuery(SQL.ALTER_TABLE_ADD_COLUMN({
		name: name,
		column: column,
		after: after_column
	}, driver));
};

export const addCollectionColumn: FxOrmSqlDDLSync__Dialect.Dialect['addCollectionColumn'] = function (
	driver, name, column, after_column, cb
) {
	const exposedErrResults = FxORMCore.Utils.exposeErrAndResultFromSyncMethod(
		() => addCollectionColumnSync(driver, name, column, after_column)
	)
	FxORMCore.Utils.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: true, callback: cb });
};

export const renameCollectionColumnSync: FxOrmSqlDDLSync__Dialect.Dialect['renameCollectionColumnSync'] = function (
	driver, name,
	oldColName: string,
	newColName: string
) {
	const sql = SQL.ALTER_TABLE_RENAME_COLUMN({
		name: name, oldColName: oldColName, newColName: newColName
	}, driver);

	return driver.execQuery(sql);
};

export const renameCollectionColumn: FxOrmSqlDDLSync__Dialect.Dialect['renameCollectionColumn'] = function (
	driver, name,
	oldColName: string,
	newColName: string, cb
) {
	const exposedErrResults = FxORMCore.Utils.exposeErrAndResultFromSyncMethod(
		() => renameCollectionColumnSync(driver, name, oldColName, newColName)
	)
	FxORMCore.Utils.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: true, callback: cb });
};

export const modifyCollectionColumnSync: FxOrmSqlDDLSync__Dialect.Dialect['modifyCollectionColumnSync'] = function (
	driver, name, column
) {
	return driver.execQuery(SQL.ALTER_TABLE_MODIFY_COLUMN({
		name: name,
		column: column
	}, driver));
};

export const modifyCollectionColumn: FxOrmSqlDDLSync__Dialect.Dialect['modifyCollectionColumn'] = function (
	driver, name, column, cb
) {
	const exposedErrResults = FxORMCore.Utils.exposeErrAndResultFromSyncMethod(
		() => modifyCollectionColumnSync(driver, name, column)
	)
	FxORMCore.Utils.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: true, callback: cb });
};

export const dropCollectionColumnSync: FxOrmSqlDDLSync__Dialect.Dialect['dropCollectionColumnSync'] = function (
	driver, name, column
) {
	throw Error('sqlite does not support dropping columns')
};

export const dropCollectionColumn: FxOrmSqlDDLSync__Dialect.Dialect['dropCollectionColumn'] = function (
	driver, name, column, cb
) {
	const exposedErrResults = FxORMCore.Utils.exposeErrAndResultFromSyncMethod(
		// () => dropCollectionColumnSync(driver, name, column)
		() => undefined as any
	)
	FxORMCore.Utils.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: true, callback: cb });
};

export const getCollectionIndexesSync: FxOrmSqlDDLSync__Dialect.Dialect['getCollectionIndexesSync'] = function (
	driver, name
) {
	const rows = driver.execQuery("PRAGMA index_list(" + driver.query.escapeId(name) + ")")

	const indexes = convertIndexRows(rows);

	for (let k in indexes) {
		if (k.match(/^sqlite_autoindex/)) {
			delete indexes[k];
			continue;
		}

		const rows = driver.execQuery(`PRAGMA index_info(${driver.query.escapeVal(k)})`);

		for (let i = 0; i < rows.length; i++) {
			indexes[k].columns.push(rows[i].name);
		}
	}

	return indexes;
};

export const getCollectionIndexes: FxOrmSqlDDLSync__Dialect.Dialect['getCollectionIndexes'] = function (
	driver, name, cb
) {
	const exposedErrResults = FxORMCore.Utils.exposeErrAndResultFromSyncMethod(
		() => getCollectionIndexesSync(driver, name)
	)
	FxORMCore.Utils.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: true, callback: cb });
};

export const addIndexSync: FxOrmSqlDDLSync__Dialect.Dialect['addIndexSync'] = function (
	driver, name, unique, collection, columns
) {
	return driver.execQuery(SQL.CREATE_INDEX({
		name: name,
		unique: unique,
		collection: collection,
		columns: columns
	}, driver));
};

export const addIndex: FxOrmSqlDDLSync__Dialect.Dialect['addIndex'] = function (
	driver, name, unique, collection, columns, cb
) {
	const exposedErrResults = FxORMCore.Utils.exposeErrAndResultFromSyncMethod(
		() => addIndexSync(driver, name, unique, collection, columns)
	)
	FxORMCore.Utils.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: true, callback: cb });
};

export const removeIndexSync: FxOrmSqlDDLSync__Dialect.Dialect['removeIndexSync'] = function (
	driver, collection, name
) {
	return driver.execQuery(`DROP INDEX IF EXISTS ${driver.query.escapeId(name)}`);
};

export const removeIndex: FxOrmSqlDDLSync__Dialect.Dialect['removeIndex'] = function (
	driver, collection, name, cb
) {
	const exposedErrResults = FxORMCore.Utils.exposeErrAndResultFromSyncMethod(
		() => removeIndexSync(driver, collection, name)
	)
	FxORMCore.Utils.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: true, callback: cb });
};

export const processKeys: FxOrmSqlDDLSync__Dialect.Dialect['processKeys'] = function (keys) {
	if (keys.length === 1) {
		return [];
	}

	return keys;
};

export const supportsType: FxOrmSqlDDLSync__Dialect.Dialect['supportsType'] = function (type) {
	switch (type) {
		case "boolean":
		case "enum":
			return "number";
	}
	return type;
};

export const getType: FxOrmSqlDDLSync__Dialect.Dialect['getType'] = function (
	collection, property: FxOrmSqlDDLSync__Column.PropertySQLite, driver
) {
	let type: false | FxOrmSqlDDLSync__Column.ColumnType_SQLite = false;
	let customType = null;

	if (property.type == 'number' && property.rational === false) {
		property.type = 'integer';
		delete property.rational;
	}

	switch (property.type) {
		case "text":
			type = "TEXT";
			break;
		case "integer":
			type = "INTEGER";
			break;
		case "number":
			type = "REAL";
			break;
		case "serial":
			property.serial = true;
			property.key = true;
			type = "INTEGER";
			break;
		case "boolean":
			type = "INTEGER UNSIGNED";
			break;
		case "datetime":
		case "date":
			type = "DATETIME";
			break;
		case "binary":
		case "object":
			type = "BLOB";
			break;
		case "enum":
			type = "INTEGER";
			break;
		case "point":
			type = "POINT";
			break;
		default:
			customType = driver.customTypes[property.type];
			if (customType) {
				type = customType.datastoreType(property, { collection, driver })
			}
	}

	if (!type) return false;

	if (property.required) {
		type += " NOT NULL";
	}
	if (property.key) {
		if (!property.required) {
			// append if not set
			type += " NOT NULL";
		}
		if (property.serial) {
			type += " PRIMARY KEY";
		}
	}
	if (property.serial) {
		if (!property.key) {
			type += " PRIMARY KEY";
		}
		type += " AUTOINCREMENT";
	}
	if (property.hasOwnProperty("defaultValue")) {
		type += " DEFAULT " + driver.query.escapeVal(property.defaultValue);
	}

	return {
		value: type,
		before: false
	};
};

function convertIndexRows(
	rows: FxOrmSqlDDLSync__Driver.DbIndexInfo_SQLite[]
): {[k: string]: FxOrmSqlDDLSync__Driver.DbIndexInfo_SQLite} {
	const indexes = <{[k: string]: FxOrmSqlDDLSync__Driver.DbIndexInfo_SQLite}>{};

	for (let i = 0; i < rows.length; i++) {
		if (!indexes.hasOwnProperty(rows[i].name)) {
			indexes[rows[i].name] = {
				columns: [],
				// unique: (rows[i].unique == 1)
				unique: rows[i].unique
			};
		}
	}

	return indexes;
}