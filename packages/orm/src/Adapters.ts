import type { FxOrmDMLDriver } from './Typo/DMLDriver';

import "./Drivers/DML";

export const add = addAdapter;
export const get = getAdapter;

// type ISupportedDBDriver = 'mysql' | 'sqlite' | 'postgresql'

const adapters = <{
	[key: string]: FxOrmDMLDriver.DMLDriverConstructor
}>{};

function addAdapter(name: string, constructor: FxOrmDMLDriver.DMLDriverConstructor) {
	adapters[name] = constructor;
}

function getAdapter(name: string): FxOrmDMLDriver.DMLDriverConstructor {
	switch (name) {
		case 'mysql':
		case 'sqlite':
			return require(`./Drivers/DML/${name}`).Driver;
		case 'pg':
		case 'psql':
		case 'postgres':
		case 'postgresql':
			return require(`./Drivers/DML/postgres`).Driver;
	}
	
	// TODO: support install dml driver from node_modules
	if (!(name in adapters)) {
		// trigger error which could be detected by `isDriverNotSupportedError`
		adapters[name] = require("./Drivers/DML/" + name).Driver;
	}

	return adapters[name];
}
