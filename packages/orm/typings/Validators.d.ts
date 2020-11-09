/// <reference types="@fibjs/enforce" />
export declare const required: FibjsEnforce.enforcementValidation;
export declare const notEmptyString: FibjsEnforce.enforcementValidation;
export declare const rangeNumber: FibjsEnforce.enforcementValidation;
export declare const rangeLength: FibjsEnforce.enforcementValidation;
export declare const insideList: FibjsEnforce.enforcementValidation;
export declare const outsideList: FibjsEnforce.enforcementValidation;
export declare const password: FibjsEnforce.enforcementValidation;
export declare const patterns: FibjsEnforce.enforcementsContainer;
import { FxOrmValidators } from "./Typo/Validators";
/**
 * Check if a value is the same as a value
 * of another property (useful for password
 * checking).
 **/
export declare function equalToProperty(name: string, msg?: string): FibjsEnforce.ValidationCallback;
/**
 * Check if a property is unique in the collection.
 * This can take a while because a query has to be made against the Model.
 *
 * Due to the async nature of node, and concurrent web server environments,
 * an index on the database column is the only way to gurantee uniqueness.
 *
 * For sensibility's sake, undefined and null values are ignored for uniqueness
 * checks.
 *
 * Options:
 *   ignoreCase: for postgres; mysql ignores case by default.
 *   scope: (Array) scope uniqueness to listed properties
 **/
export declare function unique(opts?: {
    ignoreCase?: boolean;
    scope?: string[];
}, msg?: string): FxOrmValidators.ValidationCallback;
