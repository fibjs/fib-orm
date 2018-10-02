/// <reference path="sql-query.d.ts" />
/// <reference path="../3rd.d.ts" />

declare module "@fxjs/orm" {
    import events = require('events');
    import sqlquery = require('sqlquery');

    module orm {

        /**
        * Parameter Type Interfaces
        **/

        interface ModelAssociationMethod__ComputationPayload__Merge {
            from: {table: string, field: string | string[]}
            to: {table: string, field: string | string[]}
            where: [string, ModelMethod__FindConditions]
            table
        }

        export interface ModelMethod__FindOptions {
            limit?: number;
            order?: any;
        }

        export interface ModelAssociationMethod__FindOptions extends ModelMethod__FindOptions {
            __merge?: ModelAssociationMethod__ComputationPayload__Merge;
            extra?: any[]
        }

        export interface ModelMethod__FindConditions {
            [property: string]: any
        }


        export interface ModelMethod__CommonCallback {
            (err: Error, results: Instance[]): void
        }

        export interface ModelMethod__CountCallback {
            (err: Error, count?: number): void
        }

        export interface Model {
            (): Instance;
            (...ids: any[]): Instance;

            properties: { [property: string]: Property };
            settings: Settings;

            drop(callback?: (err: Error) => void): Model;
            sync(callback?: (err: Error) => void): Model;
            get(...args: any[]): Model;

            find(): any /* OrmNS.Model|OrmNS.IChainFind */;
            find(conditions: ModelMethod__FindConditions, callback?: ModelMethod__CommonCallback): Model;
            find(conditions: ModelMethod__FindConditions, options: ModelMethod__FindOptions, callback?: ModelMethod__CommonCallback): Model;
            find(conditions: ModelMethod__FindConditions, limit: number, order: string[], callback?: ModelMethod__CommonCallback): Model;
            find(conditions: ModelMethod__FindConditions): IChainFind;

            all(conditions: ModelMethod__FindConditions, callback?: ModelMethod__CommonCallback): Model;
            all(conditions: ModelMethod__FindConditions, options: ModelMethod__FindOptions, callback?: ModelMethod__CommonCallback): Model;
            all(conditions: ModelMethod__FindConditions, limit: number, order: string[], callback?: ModelMethod__CommonCallback): Model;

            one(conditions: ModelMethod__FindConditions, callback: (err: Error, result: Instance) => void): Model;
            one(conditions: ModelMethod__FindConditions, options: ModelMethod__FindOptions, callback: (err: Error, result: Instance) => void): Model;
            one(conditions: ModelMethod__FindConditions, limit: number, order: string[], callback: (err: Error, result: Instance) => void): Model;

            count(callback: ModelMethod__CountCallback): Model;
            count(conditions: ModelMethod__FindConditions, callback: ModelMethod__CountCallback): Model;

            aggregate(conditions: ModelMethod__FindConditions): IAggregated;
            aggregate(properties: string[]): IAggregated;
            aggregate(conditions: ModelMethod__FindConditions, properties: string[]): IAggregated;

            exists(id: any, callback: (err: Error, exists: boolean) => void): Model;
            exists(...args: any[]): Model;

            create(data: { [property: string]: any; }, callback: (err: Error, instance: Instance) => void): Model;
            create(...args: any[]): Model;

            clear(): Model;

            table: string;
            // id: string[];
            id: string;

            [property: string]: any;
        }

        export interface Instance {
            on(event: string, callback): Instance;
            save(): Instance;
            save(data: { [property: string]: any; }, callback: (err: Error) => void): Instance;
            save(data: { [property: string]: any; }, options: any, callback: (err: Error) => void): Instance;
            saved(): boolean;
            remove(callback: (err: Error) => void): Instance;
            isInstance: boolean;
            isPersisted(): boolean;
            isShell: boolean;
            validate(callback: (errors: Error[]) => void);
            model: Model;

            [property: string]: any;
        }

        export interface ModelOptions {
            id?: string[];
            autoFetch?: boolean;
            autoFetchLimit?: number;
            cacheFetch?: boolean;
            hooks?: { [property: string]: Hooks };
            methods?: { [name: string]: Function };
        }

        export interface Hooks {
            beforeValidation?: (next?) => void;
            beforeCreate?: (next?) => void;
            afterCreate?: (next?) => void;
            beforeSave?: (next?) => void;
            afterSave?: (next?) => void;
            afterLoad?: (next?) => void;
            afterAutoFetch?: (next?) => void;
            beforeRemove?: (next?) => void;
            afterRemove?: (next?) => void;
        }

        export interface IConnectionOptions {
            protocol: string;
            host?: string;
            port?: number;
            auth?: string;
            username?: string;
            password?: string;
            database?: string;
            pool?: boolean;
            debug?: boolean;
        }

        export interface IAggregated {
            groupBy(...columns: string[]): IAggregated;
            limit(limit: number): IAggregated;
            limit(offset: number, limit: number): IAggregated;
            order(...order: string[]): IAggregated;
            select(columns: string[]): IAggregated;
            select(...columns: string[]): IAggregated;
            as(alias: string): IAggregated;
            call(fun: string, args: any[]): IAggregated;
            get(callback: (err: Error, instance: Instance) => void);
        }

        export interface IChainFind {
            find(conditions: ModelMethod__FindConditions): IChainFind;
            
            only(...args: string[]): IChainFind;
            limit(limit: number): IChainFind;
            offset(offset: number): IChainFind;
            run(callback?: ModelMethod__CommonCallback): void;
            count(callback: ModelMethod__CountCallback): void;
            remove(callback: (err: Error) => void): void;
            save(callback: (err: Error) => void): void;
            each(callback: (result: Instance) => void): void;
            each(): IChainFind;
            filter(callback: (result: Instance) => boolean): IChainFind;
            sort(callback: (a: Instance, b: Instance) => boolean): IChainFind;
            get(callback: (results: Instance[]) => void): IChainFind;

        }

        export interface ChainFindInstanceType {
            all(conditions: ModelMethod__FindConditions): IChainFind;
            where(conditions: ModelMethod__FindConditions): IChainFind;
            find(conditions: ModelMethod__FindConditions): IChainFind;

            only(...args: string[]): IChainFind;
            omit(): IChainFind;
            skip(offset: number): IChainFind;
            offset(offset: number): IChainFind;

            order(propertyOrderDesc: string, order: string | "Z" | "A" ): IChainFind;
            orderRaw(str: string, args: any[]): IChainFind;
            limit(limit: number): IChainFind;
            count(callback: ModelMethod__CountCallback): void;
            remove(callback: (err: Error) => void): void;
            run(callback?: ModelMethod__CommonCallback): void;
            
            success(callback?: ModelMethod__CommonCallback): void;
            fail(callback?: ModelMethod__CommonCallback): void;

            first(callback?: ModelMethod__CommonCallback): void;
            last(callback?: ModelMethod__CommonCallback): void;

            each(callback: (result: Instance) => void): void;
            each(): IChainFind;
            
            eager(): IChainFind;

            model: FibOrmFixedModel;
            options: ChainFindOptions
        }

        export interface ChainFindOptions {
            conditions
            properties
            order
            driver
            only
            table
            limit
            merge
            offset
            exists
            __eager
            keys
            newInstance
            keyProperties
            associations
        }

        /*
         * Classes
        */

        export class ORM extends events.EventEmitter {
            validators: enforce;
            enforce: enforce;
            settings: Settings;
            driver_name: string;
            driver: any;
            tools: any;
            models: { [key: string]: Model };
            plugins: Plugin[];

            use(plugin: string, options?: any): ORM;
            use(plugin: Plugin, options?: any): ORM;

            define(name: string, properties: { [key: string]: Property }, opts?: ModelOptions): Model;
            ping(callback: (err: Error) => void): ORM;
            close(callback: (err: Error) => void): ORM;
            load(file: string, callback: (err: Error) => void): any;
            sync(callback: (err: Error) => void): ORM;
            drop(callback: (err: Error) => void): ORM;
        }

        export class enforce {
            static required(message?: string);
            static notEmptyString(message?: string);
            static rangeNumber(min: number, max: number, message?: string);
            static rangeLength(min: number, max: number, message?: string);
            static insideList(inside: string[], message?: string);
            static insideList(inside: number[], message?: string);
            static outsideList(outside: string[], message?: string);
            static outsideList(outside: number[], message?: string);
            static password(conditions?: string, message?: string);
            static patterns(expr: RegExp, message?: string);
            static patterns(expr: string, flags: string, message?: string);
            static equalToProperty(name: string, message?: string);
            static unique(message?: string);
            static unique(opts: { ignoreCase: boolean }, message?: string);
        }

        export function equalToProperty(name: string, message?: string);
        export function unique(message?: string);
        export function unique(opts: { ignoreCase: boolean }, message?: string);

        export interface SingletonOptions {
            identityCache?: any;
            saveCheck?: boolean;
        }
        
        export class singleton {
            static clear(key?: string): singleton;
            static get(key, opts: SingletonOptions, createCb: Function, returnCb: Function);
        }

        export class Settings {
            static Container: any;

            static defaults(): {
                properties: {
                    primary_key: string;
                    association_key: string;
                    required: boolean;
                };

                instance: {
                    identityCache: boolean;
                    identityCacheSaveCheck: boolean;
                    autoSave: boolean;
                    autoFetch: boolean;
                    autoFetchLimit: number;
                    cascadeRemove: boolean;
                    returnAllErrors: boolean;
                };

                connection: {
                    reconnect: boolean;
                    poll: boolean;
                    debug: boolean;
                };
            };

            constructor(settings: any);

            get: {
                (key: string, def?: Function): any
            }
            //[key: string]: {
            //    get: (key, def) => any;
            //    set: (key, value) => Settings;
            //    unset: (...keys: string[]) => Settings;
            //}

        }

        export var settings: Settings;

        export class Property {
            static normalize(property: string, settings: Settings): any;
            static validate(value: any, property: string): any;
        }

        export interface ErrorCodes {
            QUERY_ERROR: number;
            NOT_FOUND: number;
            NOT_DEFINED: number;
            NO_SUPPORT: number;
            MISSING_CALLBACK: number;
            PARAM_MISMATCH: number;
            CONNECTION_LOST: number;

            generateError(code: number, message: string, extra: any): Error;
        }

        export function Text(type: string): sqlquery.TextQuery;
        export function eq(value: any): sqlquery.Comparator;
        export function ne(value: any): sqlquery.Comparator;
        export function gt(value: any): sqlquery.Comparator;
        export function gte(value: any): sqlquery.Comparator;
        export function lt(value: any): sqlquery.Comparator;
        export function lte(value: any): sqlquery.Comparator;
        export function like(value: string): sqlquery.Comparator;
        export function between(a: number, b: number): sqlquery.Comparator;
        export function not_between(a: number, b: number): sqlquery.Comparator;
        export function express(uri: string, handlers: {
            define(db: ORM, models: { [key: string]: Model });
        }): (req, res, next) => void;
        export function use(connection, protocol: string, options, callback: (err: Error, db?: ORM) => void);
        export function connect(uri: string): ORM;
        export function connect(uri: string, callback: (err: Error, db: ORM) => void);
        export function connect(options: IConnectionOptions): ORM;
        export function connect(options: IConnectionOptions, callback: (err: Error, db: ORM) => void);
    }

    export = orm;
}
