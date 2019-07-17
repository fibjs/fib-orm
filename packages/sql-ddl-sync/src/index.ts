/// <reference types="@fxjs/orm-core" />
/// <reference path="../@types/index.d.ts" />

import FxORMCore = require("@fxjs/orm-core");
import util  = require('util')
import { getSqlQueryDialect, logJson } from './Utils';

const noOp = () => {};

export const dialect: FxOrmSqlDDLSync.ExportModule['dialect'] = function (name) {
	const Dialects = require('./Dialects')

	if (!Dialects[name])
		throw `no dialect with name '${name}'`
		
	return Dialects[name];
}

/**
 * @description iterate collection, create property's column which didn't exist.
 * 
 * @param collection 
 * @param force_sync (dangerous) if force re-syncing property to column
 */
function processCollection (
	syncInstnace: Sync,
	collection: FxOrmSqlDDLSync__Collection.Collection,
	force_sync: boolean,
) {
	let has: boolean;
	let is_processed: boolean = false;

	has = syncInstnace.Dialect.hasCollectionSync(syncInstnace.dbdriver, collection.name)

	if (!has) {
		syncInstnace.createCollection(collection)
		is_processed = true;
	}

	syncInstnace.syncCollection(collection, { strategy: force_sync ? 'hard' : 'solf' })

	// if (!force_sync)
	// 	return is_processed

	// return true;
}

/**
 * @description compute system's index name by dialect type
 * 
 * @param collection collection to indexed
 * @param prop column's property
 */
function getIndexName (
	collection: FxOrmSqlDDLSync__Collection.Collection,
	prop: FxOrmSqlDDLSync__Column.Property,
	dialect_type: string
) {
	const post = prop.unique ? 'unique' : 'index';

	if (dialect_type == 'sqlite') {
		return collection.name + '_' + prop.name + '_' + post;
	} else {
		return prop.name + '_' + post;
	}
}

/**
 * @param collection table where column created
 * @param prop column's property
 */
function getColumnTypeRaw (
	syncInstance: Sync,
	collection_name: FxOrmSqlDDLSync.TableName,
	prop: FxOrmSqlDDLSync__Column.Property,
	opts?: {
		for?: FxOrmSqlDDLSync__Dialect.DielectGetTypeOpts['for']
	}
): false | FxOrmSqlDDLSync__Dialect.DialectResult {
	let type: false | string | FxOrmSqlDDLSync__Dialect.TypeResult;

	/**
	 * get type, customTypes first
	 */
	if (syncInstance.types.hasOwnProperty(prop.type)) {
		type = syncInstance.types[prop.type].datastoreType(prop);
	} else { // fallback to driver's types
		const { for: _for = 'create_table' } = opts || {};
		type = syncInstance.Dialect.getType(collection_name, prop, syncInstance.dbdriver, { for: _for });
	}

	if (!type)
		return false;
		
	if (typeof type == "string") {
		type = { value : type };
	}

	if (prop.mapsTo === undefined)
		throw new Error("undefined prop.mapsTo" + JSON.stringify(prop))

	return {
		value: getSqlQueryDialect(syncInstance.dbdriver.type).escapeId(prop.mapsTo) + " " + type.value,
	};
}

/**
 * @description if sync one column
 * 
 * @param property existed property in collection
 * @param column column expected to be synced
 */
function needToSync (
	syncInstance: Sync,
	property: FxOrmSqlDDLSync__Column.Property,
	column: FxOrmSqlDDLSync__Column.Property
): boolean {
	if (property.serial && property.type == "number") {
		property.type = "serial";
	}
	if (property.type != column.type) {
		if (typeof syncInstance.Dialect.supportsType != "function") {
			return true;
		}
		if (syncInstance.Dialect.supportsType(property.type) != column.type) {
			return true;
		}
	}
	if (property.type == "serial") {
		return false; // serial columns have a fixed form, nothing more to check
	}
	if (property.required != column.required && !property.key) {
		return true;
	}
	if (property.hasOwnProperty("defaultValue") && property.defaultValue != column.defaultValue) {
		return true;
	}
	if (property.type == "number" || property.type == "integer") {
		if (column.hasOwnProperty("size") && (property.size || 4) != column.size) {
			return true;
		}
	}
	if (property.type == "enum" && column.type == "enum") {
		if (util.difference(property.values, column.values).length > 0
		|| util.difference(column.values, property.values).length > 0) {
			return true;
		}
	}

	return false;
}

export class Sync<ConnType = any> implements FxOrmSqlDDLSync.Sync<ConnType> {
	/**
	 * @description total changes count in this time `Sync`
	 * @deprecated
	 */
	total_changes: FxOrmSqlDDLSync.Sync['total_changes']
	
	readonly collections: FxOrmSqlDDLSync__Collection.Collection[]

	readonly dbdriver: FxOrmSqlDDLSync.Sync['dbdriver']
	readonly Dialect: FxOrmSqlDDLSync.Sync['Dialect']
	/**
	 * @description customTypes
	 */
	readonly types: FxOrmSqlDDLSync.Sync['types']

	private suppressColumnDrop: boolean
	private debug: Exclude<FxOrmSqlDDLSync.SyncOptions['debug'], false>

	constructor (options: FxOrmSqlDDLSync.SyncOptions) {
		const dbdriver = options.dbdriver

		this.suppressColumnDrop = options.suppressColumnDrop || dbdriver.type === 'sqlite'
		this.debug = typeof options.debug === 'function' ? options.debug : noOp

		Object.defineProperty(this, 'types', { value: {}, writable: false })
		Object.defineProperty(this, 'collections', { value: [], writable: false })
		Object.defineProperty(this, 'dbdriver', { value: dbdriver, writable: false })
		Object.defineProperty(this, 'Dialect', { value: dialect(dbdriver.type as any), writable: false })
	}

	[sync_method: string]: any
	
	defineCollection (collection_name: string, properties: FxOrmSqlDDLSync__Collection.Collection['properties']) {
		let idx = this.collections.findIndex(collection => collection.name === collection_name)
		if (idx >= 0)
			this.collections.splice(idx, 1)

		this.collections.push({
			name       : collection_name,
			properties : properties
		});
			
		return this;
	}

	findCollection (collection_name: string): null | FxOrmSqlDDLSync__Collection.Collection {
		return this.collections.find(collection => collection.name === collection_name) || null
	}

	defineType (type: string, proto: FxOrmSqlDDLSync__Driver.CustomPropertyType) {
		this.types[type] = proto;
		return this;
	}

	createCollection (collection: FxOrmSqlDDLSync__Collection.Collection) {
		const columns: string[] = [];

		let keys: string[] = [];

		for (let k in collection.properties) {
			let prop: FxOrmSqlDDLSync__Column.Property,
				col: false | FxOrmSqlDDLSync__Dialect.DialectResult;

			prop = collection.properties[k];
			prop.mapsTo = prop.mapsTo || k;

			col = getColumnTypeRaw(this, collection.name, prop, { for: 'create_table' });

			if (col === false) {
				logJson('createCollection', prop);
				throw new Error(`Invalid type definition for property '${k}'.`);
			}

			if (prop.key) keys.push(prop.mapsTo);
			columns.push(col.value);
		}

		this.debug("Creating " + collection.name);

		if (typeof this.Dialect.processKeys === "function")
			keys = this.Dialect.processKeys(keys);

		this.total_changes += 1;
		
		const result_1 = this.Dialect.createCollectionSync(
			this.dbdriver,
			collection.name, columns, keys
		);

		this.syncIndexes(collection.name, this.getCollectionIndexes(collection));

		return result_1;
	}

	syncCollection (
		_collection: string | FxOrmSqlDDLSync__Collection.Collection,
		opts?: FxOrmSqlDDLSync.SyncCollectionOptions
	) {
		const collection = typeof _collection === 'string' ? this.findCollection(_collection) : _collection;

		if (!collection)
			throw new Error('[syncCollection] invalid collection')

		let {
			columns = this.Dialect.getCollectionPropertiesSync(this.dbdriver, collection.name),
			strategy = 'soft',
		} = opts || {};

		if (!['soft', 'hard'].includes(strategy)) strategy = 'soft';
		
		let last_k: string  = null;

		this.debug("Synchronizing " + collection.name);
		
		for (let k in collection.properties) {
			const prop = collection.properties[k];
			if (!columns.hasOwnProperty(k)) {
				prop.mapsTo = prop.mapsTo || k;

				const col = getColumnTypeRaw(this, collection.name, prop, { for: 'add_column' });

				if (col === false) {
					logJson('syncCollection', prop);
					throw new Error(`Invalid type definition for property '${k}'.`);
				}

				this.debug("Adding column " + collection.name + "." + k + ": " + col.value);

				this.total_changes += 1;
				
				this.Dialect.addCollectionColumnSync(
					this.dbdriver,
					collection.name,
					col.value,
					last_k
				)
			} else if (strategy === 'hard' && this.dbdriver.type !== 'sqlite' && needToSync(this, prop, columns[k])) {
				const col = getColumnTypeRaw(this, collection.name, prop, { for: 'alter_column' });

				if (col === false) {
					logJson('syncCollection', prop);
					throw new Error(`Invalid type definition for property '${k}'.`);
				}

				this.debug("Modifying column " + collection.name + "." + k + ": " + col.value);

				this.total_changes += 1;
				
				this.Dialect.modifyCollectionColumnSync(
					this.dbdriver,
					collection.name,
					col.value
				);
			}

			last_k = k;
		}

        if ( !this.suppressColumnDrop ) {
            for (let k in columns) {
                if (!collection.properties.hasOwnProperty(k)) {
                    this.debug("Dropping column " + collection.name + "." + k);

					this.total_changes += 1;

					return this.Dialect.dropCollectionColumnSync(this.dbdriver, collection.name, k);
                }
            }
        }

		const indexes = this.getCollectionIndexes(collection);

		if (indexes.length) this.syncIndexes(collection.name, indexes);
	}

	/**
	 * 
	 * @param collection collection relation to find its indexes
	 */
	getCollectionIndexes (
		collection: FxOrmSqlDDLSync__Collection.Collection
	): FxOrmSqlDDLSync__DbIndex.DbIndexInfo[] {
		let indexes: FxOrmSqlDDLSync__DbIndex.DbIndexInfo[] = [];
		let found: boolean,
			prop: FxOrmSqlDDLSync__Column.Property;

		for (let k in collection.properties) {
			prop = collection.properties[k];

			if (prop.unique) {
				let mixed_arr_unique: (string | true)[] = prop.unique as string[]
				if (!Array.isArray(prop.unique)) {
					mixed_arr_unique = [ prop.unique ];
				}

				for (let i = 0; i < mixed_arr_unique.length; i++) {
					if (mixed_arr_unique[i] === true) {
						indexes.push({
							name    : getIndexName(collection, prop, this.dbdriver.type),
							unique  : true,
							columns : [ k ]
						});
					} else {
						found = false;

						for (let j = 0; j < indexes.length; j++) {
							if (indexes[j].name == mixed_arr_unique[i]) {
								found = true;
								indexes[j].columns.push(k);
								break;
							}
						}

						if (!found) {
							indexes.push({
								name    : mixed_arr_unique[i] as string,
								unique  : true,
								columns : [ k ]
							});
						}
					}
				}
			}
			
			if (prop.index) {
				let mixed_arr_index: (string | true)[] = prop.index as string[]
				if (!Array.isArray(prop.index)) {
					mixed_arr_index = [ prop.index ];
				}

				for (let i = 0; i < mixed_arr_index.length; i++) {
					if (mixed_arr_index[i] === true) {
						indexes.push({
							name    : getIndexName(collection, prop, this.dbdriver.type),
							columns : [ k ]
						});
					} else {
						found = false;

						for (let j = 0; j < indexes.length; j++) {
							if (indexes[j].name == mixed_arr_index[i]) {
								found = true;
								indexes[j].columns.push(k);
								break;
							}
						}
						if (!found) {
							indexes.push({
								name    : mixed_arr_index[i] as string,
								columns : [ k ]
							});
						}
					}
				}
			}
		}

		if (typeof this.Dialect.convertIndexes == "function") {
			indexes = this.Dialect.convertIndexes(collection, indexes);
		}

		return indexes;
	}

	syncIndexes (
		collection_name: string,
		indexes: FxOrmSqlDDLSync__DbIndex.DbIndexInfo[]
	): void {
		if (indexes.length == 0) return ;

		const db_indexes = this.Dialect.getCollectionIndexesSync(this.dbdriver, collection_name);

		for (let i = 0; i < indexes.length; i++) {
			if (!db_indexes.hasOwnProperty(indexes[i].name)) {
				this.debug("Adding index " + collection_name + "." + indexes[i].name + " (" + indexes[i].columns.join(", ") + ")");

				this.total_changes += 1;

				const index = indexes[i];
				this.Dialect.addIndexSync(this.dbdriver, index.name, index.unique, collection_name, index.columns);
				continue;
			} else if (!db_indexes[indexes[i].name].unique != !indexes[i].unique) {
				this.debug("Replacing index " + collection_name + "." + indexes[i].name);

				this.total_changes += 1;

				const index = indexes[i];
				this.Dialect.removeIndexSync(this.dbdriver, index.name, collection_name);
				this.Dialect.addIndexSync(this.dbdriver, index.name, index.unique, collection_name, index.columns);
			}
			delete db_indexes[indexes[i].name];
		}

		for (let idx in db_indexes) {
			this.debug("Removing index " + collection_name + "." + idx);

			this.total_changes += 1;

			this.Dialect.removeIndexSync(this.dbdriver, collection_name, idx);
		}
	}

	sync (cb?: FxOrmCoreCallbackNS.ExecutionCallback<FxOrmSqlDDLSync.SyncResult>) {
		const exposedErrResults = FxORMCore.Utils.exposeErrAndResultFromSyncMethod<FxOrmSqlDDLSync.SyncResult>(
			() => {
				this.total_changes = 0;
				this.collections.forEach(collection => processCollection(this, collection, false))

				return {
					changes: this.total_changes
				};
			}
		)
		FxORMCore.Utils.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: !!cb, callback: cb });

		return exposedErrResults.result;
	};
	
	forceSync (cb?: FxOrmCoreCallbackNS.ExecutionCallback<FxOrmSqlDDLSync.SyncResult>) {
		const exposedErrResults = FxORMCore.Utils.exposeErrAndResultFromSyncMethod<FxOrmSqlDDLSync.SyncResult>(
			() => {
				this.total_changes = 0;
				this.collections.forEach(collection => processCollection(this, collection, true))

				return {
					changes: this.total_changes
				};
			}
		)
		FxORMCore.Utils.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: !!cb, callback: cb });

		return exposedErrResults.result;
	};
}
