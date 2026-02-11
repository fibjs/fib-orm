import type { FxOrmDMLDriver } from './Typo/DMLDriver';

import * as DMLs from "./Drivers/DML";

const adapters = <{
	[key: string]: FxOrmDMLDriver.DMLDriverConstructor
}>{};

export function addAdapter(name: string, constructor: FxOrmDMLDriver.DMLDriverConstructor) {
	if (adapters.hasOwnProperty(name)) {
		throw new Error(`[addAdapter] adapter '${name}' already exists`);
	}

	Object.defineProperty(adapters, name, {
		get () {
			return constructor
		},
		configurable: false
	})
}

addAdapter('mysql', DMLs.mysql.Driver);
addAdapter('sqlite', DMLs.sqlite.Driver);
addAdapter('postgres', DMLs.postgres.Driver);
addAdapter('dm', DMLs.dm.Driver);

export function getAdapter(name: string): FxOrmDMLDriver.DMLDriverConstructor {
	switch (name) {
		case 'mysql':
		case 'sqlite':
			break;
		case 'pg':
		case 'psql':
		case 'postgres':
		case 'postgresql':
			name = 'postgres';
			break;
		case 'dm':
			break;
	}
	
	// TODO: support install dml driver from node_modules
	if (!(name in adapters)) {
		// trigger error which could be detected by `isDriverNotSupportedError`
		const err = new Error(`No adapter named '${name}' found.`);
		(err as any).code = 'MODULE_NOT_FOUND';
		throw err;
	}

	return adapters[name];
}
