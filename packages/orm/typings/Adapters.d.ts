import type { FxOrmDMLDriver } from './Typo/DMLDriver';
export declare function addAdapter(name: string, constructor: FxOrmDMLDriver.DMLDriverConstructor): void;
export declare function getAdapter(name: string): FxOrmDMLDriver.DMLDriverConstructor;
