import fs = require('fs');
import path = require('path');
import type { FxOrmDMLDriver } from './Typo/DMLDriver';

import "./Drivers/DML";

export const add = addAdapter;
export const get = getAdapter;

const adapters = <{
	[key: string]: FxOrmDMLDriver.DMLDriverConstructor
}>{};

function addAdapter(name: string, constructor: FxOrmDMLDriver.DMLDriverConstructor) {
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

function getAdapter(name: string): FxOrmDMLDriver.DMLDriverConstructor {
	const modulePath = `./Drivers/DML/${name}`;
	switch (name) {
		case 'mysql':
		case 'sqlite':
			return require(modulePath).Driver;
		case 'pg':
		case 'psql':
		case 'postgres':
		case 'postgresql':
			return require(`./Drivers/DML/postgres`).Driver;
	}
	
	// TODO: support install dml driver from node_modules
	if (!(name in adapters)) {
		if (!fs.exists(path.resolve(__dirname, modulePath))) {
			// trigger error which could be detected by `isDriverNotSupportedError`
			const err = new Error('No such file or directory');
			(err as any).code = 'MODULE_NOT_FOUND';
			throw err;
		}
	}

	return adapters[name];
}
