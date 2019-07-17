/// <reference types="@fxjs/orm-core" />
/// <reference path="../@types/index.d.ts" />

import FxORMCore = require("@fxjs/orm-core");
import util  = require('util')
import { logJson, getDialect } from './Utils';

const noOp = () => {};

export const dialect: FxOrmSqlDDLSync.ExportModule['dialect'] = function (name) {
	const Dialects = require('./Dialects')

	if (!Dialects[name])
		throw `no dialect with name '${name}'`
		
	return Dialects[name];
}

function makeSyncIteration (syncInstnace: Sync, force_sync: boolean = false): FxOrmSqlDDLSync.SyncResult {
	syncInstnace.total_changes = 0;

	syncInstnace.collections.forEach(collection => {
		syncInstnace.processCollection(collection, force_sync)
	})

	return {
		changes: syncInstnace.total_changes
	};
}

export class Sync<ConnType = any> implements FxOrmSqlDDLSync.Sync {
	/**
	 * @description total changes count in this time `Sync`
	 * @deprecated
	 */
	total_changes: number
	collections: FxOrmSqlDDLSync__Collection.Collection[] = []

	private dbdriver: FxDbDriverNS.Driver<ConnType>
	private Dialect: FxOrmSqlDDLSync__Dialect.Dialect
	private suppressColumnDrop: boolean
	private debug: Exclude<FxOrmSqlDDLSync.SyncOptions['debug'], false>

	constructor (
		options: FxOrmSqlDDLSync.SyncOptions,
		/**
		 * @description customTypes
		 */
		private types = <FxOrmSqlDDLSync__Driver.CustomPropertyTypeHash>{}
	) {
		const dbdriver = this.dbdriver = options.dbdriver
		this.Dialect = dialect(dbdriver.type as any)

		this.suppressColumnDrop = options.suppressColumnDrop
		this.debug = options.debug || noOp
	}

	[sync_method: string]: any
	
	defineCollection (collection_name: string, properties: FxOrmSqlDDLSync__Collection.Collection['properties']): FxOrmSqlDDLSync.Sync {
		this.collections.push({
			name       : collection_name,
			properties : properties
		});
		return this;
	}
	defineType (type: string, proto: FxOrmSqlDDLSync__Driver.CustomPropertyType): FxOrmSqlDDLSync.Sync {
		this.types[type] = proto;
		return this;
	}

	sync (cb?: FxOrmCoreCallbackNS.ExecutionCallback<FxOrmSqlDDLSync.SyncResult>) {
		const exposedErrResults = FxORMCore.Utils.exposeErrAndResultFromSyncMethod<FxOrmSqlDDLSync.SyncResult>(
			() => makeSyncIteration(this, false)
		)
		FxORMCore.Utils.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: !!cb, callback: cb });

		return exposedErrResults.result;
	};
	
	forceSync (cb?: FxOrmCoreCallbackNS.ExecutionCallback<FxOrmSqlDDLSync.SyncResult>) {
		const exposedErrResults = FxORMCore.Utils.exposeErrAndResultFromSyncMethod<FxOrmSqlDDLSync.SyncResult>(
			() => makeSyncIteration(this, true)
		)
		FxORMCore.Utils.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: !!cb, callback: cb });

		return exposedErrResults.result;
	};

	processCollection (
		collection: FxOrmSqlDDLSync__Collection.Collection,
		force_sync: boolean,
	) {
		let has: boolean;
		let is_processed: boolean = false;

		try {
			has = this.Dialect.hasCollectionSync(this.dbdriver, collection.name)
		} catch (err) {
			throw err
		}

		if (!has) {
			this.createCollectionSync(collection)
			is_processed = true;
		}

		if (!force_sync)
			// not process, callback `false`
			return is_processed

		const columns: FxOrmSqlDDLSync__Column.PropertyHash = this.Dialect.getCollectionPropertiesSync(this.dbdriver, collection.name)
		this.syncCollection(collection, columns)

		// processed, callback `true`
		return true;
	}

	/**
	 * 
	 * @param collection collection relation to create 
	 */
	private createCollectionSync (
		collection: FxOrmSqlDDLSync__Collection.Collection
	) {
		const columns: string[] = [];
		const before: Function[]  = [];

		let keys: string[] = [];

		for (let k in collection.properties) {
			let prop: FxOrmSqlDDLSync__Column.Property,
				col: false | FxOrmSqlDDLSync__Column.OpResult__CreateColumn;

			prop = collection.properties[k];
			prop.mapsTo = prop.mapsTo || k;

			col = this.createColumn(collection.name, prop);

			if (col === false) {
				logJson('createCollection', prop);
				throw new Error(`Invalid type definition for property '${k}'.`);
			}

			if (prop.key) keys.push(prop.mapsTo);
			columns.push(col.value);
			if (col.before) before.push(col.before.bind(col));
		}

		this.debug("Creating " + collection.name);

		if (typeof this.Dialect.processKeys === "function") {
			keys = this.Dialect.processKeys(keys);
		}

		this.total_changes += 1;

		for (let _before of before) {
			// error maybe throwed from here
			_before(this.dbdriver);
		}
		
		const result_1 = this.Dialect.createCollectionSync(
			this.dbdriver,
			collection.name, columns, keys
		);

		this.syncIndexes(collection.name, this.getCollectionIndexes(collection));

		return result_1;
	}

	/**
	 * @param collection table where column created
	 * @param prop column's property
	 */
	private createColumn (
		collection_name: FxOrmSqlDDLSync.TableName,
		prop: FxOrmSqlDDLSync__Column.Property
	): false | FxOrmSqlDDLSync__Column.OpResult__CreateColumn {
		let type: false | string | FxOrmSqlDDLSync__Column.OpResult__CreateColumn;

		/**
		 * get type, customTypes first
		 */
		if (this.types.hasOwnProperty(prop.type)) {
			type = this.types[prop.type].datastoreType(prop);
		} else { // fallback to driver's types
			type = this.Dialect.getType(collection_name, prop, this.dbdriver);
		}

		if (!type)
			return false;
			
		if (typeof type == "string") {
			type = <FxOrmSqlDDLSync__Column.OpResult__CreateColumn>{ value : type };
		}

		if (prop.mapsTo === undefined) {
			console.log("undefined prop.mapsTo", prop, (new Error()).stack)
		}

		return {
			value  : getDialect(this.dbdriver.type).escapeId(prop.mapsTo) + " " + type.value,
			before : type.before
		};
	}

	private syncCollection (
		collection: FxOrmSqlDDLSync__Collection.Collection,
		columns: FxOrmSqlDDLSync__Column.PropertyHash
	) {
		let last_k: string  = null;

		this.debug("Synchronizing " + collection.name);
		
		for (let k in collection.properties) {
			const prop = collection.properties[k];
			if (!columns.hasOwnProperty(k)) {
				const col = this.createColumn(collection.name, prop);

				if (col === false) {
					logJson('syncCollection', prop);
					throw new Error(`Invalid type definition for property '${k}'.`);
				}

				this.debug("Adding column " + collection.name + "." + k + ": " + col.value);

				this.total_changes += 1;

				if (col.before) {
					const _before = col.before.bind(col);
					// error maybe throwed from here
					_before(this.dbdriver);
				}
				
				this.Dialect.addCollectionColumnSync(
					this.dbdriver,
					collection.name,
					col.value,
					last_k
				)
			} else if (this.dbdriver.type !== 'sqlite' && this.needToSync(prop, columns[k])) {
				// var col = this.createColumn(collection.name, k/* prop */);
				const col = this.createColumn(collection.name, prop);

				if (col === false) {
					logJson('syncCollection', prop);
					throw new Error(`Invalid type definition for property '${k}'.`);
				}

				this.debug("Modifying column " + collection.name + "." + k + ": " + col.value);

				this.total_changes += 1;

				if (col.before) {
					const _before = col.before.bind(col);
					// error maybe throwed from here
					_before(this.dbdriver);
				}
				
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

		var indexes = this.getCollectionIndexes(collection);

		if (indexes.length) {
			this.syncIndexes(collection.name, indexes);
		}
	}

	/**
	 * @description compute system's index name by dialect type
	 * 
	 * @param collection collection to indexed
	 * @param prop column's property
	 */
	private getIndexName (
		collection: FxOrmSqlDDLSync__Collection.Collection, prop: FxOrmSqlDDLSync__Column.Property
	) {
		var post = prop.unique ? 'unique' : 'index';

		if (this.dbdriver.dialect == 'sqlite') {
			return collection.name + '_' + prop.name + '_' + post;
		} else {
			return prop.name + '_' + post;
		}
	}

	/**
	 * 
	 * @param collection collection relation to find its indexes
	 */
	private getCollectionIndexes (
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
							name    : this.getIndexName(collection, prop),
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
							name    : this.getIndexName(collection, prop),
							columns : [ k ]
						});
					} else {
						found = false;

						for (var j = 0; j < indexes.length; j++) {
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

	private syncIndexes (
		collection_name: string,
		indexes: FxOrmSqlDDLSync__DbIndex.DbIndexInfo[]
	): string|FxOrmSqlDDLSync__DbIndex.DbIndexInfo {
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

	private needToSync (
		property: FxOrmSqlDDLSync__Column.Property,
		column: FxOrmSqlDDLSync__Column.Property
	): boolean {
		if (property.serial && property.type == "number") {
			property.type = "serial";
		}
		if (property.type != column.type) {
			if (typeof this.Dialect.supportsType != "function") {
				return true;
			}
			if (this.Dialect.supportsType(property.type) != column.type) {
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
}
