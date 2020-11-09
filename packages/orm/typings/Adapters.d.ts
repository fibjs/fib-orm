import type { FxOrmDMLDriver } from './Typo/DMLDriver';
import "./Drivers/DML";
export declare const add: typeof addAdapter;
export declare const get: typeof getAdapter;
declare function addAdapter(name: string, constructor: FxOrmDMLDriver.DMLDriverConstructor): void;
declare function getAdapter(name: string): FxOrmDMLDriver.DMLDriverConstructor;
export {};
