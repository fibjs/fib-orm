/// <reference path="sql-query.d.ts" />
/// <reference path="../3rd.d.ts" />

declare module "@fxjs/orm" {
    import events = require('events');
    import sqlquery = require('sqlquery');
    import SqlQueryNS from 'sqlquery'
    type Buffer = Class_Buffer

    module orm {
        /* Connection About Patch :start */
    
        interface ExtensibleError extends Error {
            [extensibleProperty: string]: any
        }
    
        /**
         * it should be defined in 'orm' but there is not, so we should fix it
         */
        interface ConnInstanceInOrmConnDriverDB {
            begin(): void;
            close(): void;
            commit(): void;
            rollback(): void;
            trans(func: Function): boolean
            execute(sql: string, ...args: any[]): any[];
        }
    
        interface SQLiteConnInstanceInOrmConnDriverDB extends ConnInstanceInOrmConnDriverDB, Class_SQLite {
        }
        interface MySQLConnInstanceInOrmConnDriverDB extends ConnInstanceInOrmConnDriverDB, Class_MySQL {
        }
        interface MSSQLConnInstanceInOrmConnDriverDB extends ConnInstanceInOrmConnDriverDB, Class_MSSQL {
        }
    
        interface DbInstanceInOrmConnDriver {
            conn: ConnInstanceInOrmConnDriverDB
        }
        export interface OrigOrmExecQueryOpts {
            [key: string]: any;
        }
        export interface OrigOrmConnDriver {
            // dialog type
            dialect: string;
            propertyToValue: Function;
            valueToProperty: Function;
            insert: Function;
            db: DbInstanceInOrmConnDriver
        }
        /**
         * then we should patch still
         */
        export interface PatchedOrmConnDriver extends OrigOrmConnDriver {
            execQuerySync: (query: SqlQueryNS.Query, opt: OrigOrmExecQueryOpts) => any
        }
    
        export interface OrmConnectionOpts {
        }
        /* Connection About Patch :end */
    
        interface ORMMethod__CommonCallback {
            (err: Error): void
        }
    
        export interface FibOrmFixedModelOptions /* extends ModelOptions */ {
            id?: string[];
            autoFetch?: boolean;
            autoFetchLimit?: number;
            cacheFetch?: boolean;
            hooks?: Hooks;
            methods?: { [name: string]: Function };
    
            [extensibleProperty: string]: any;
        }
    
        export interface FibORM extends ORM {
            /* all fixed: start */
            models: { [key: string]: FibOrmFixedModel };
            
            use(plugin: string, options?: any): FibORM;
            use(plugin: Plugin, options?: any): FibORM;
    
            define(name: string, properties: { [key: string]: OrigModelPropertyDefinition }, opts?: FibOrmFixedModelOptions): FibOrmFixedModel;
            ping(callback: ORMMethod__CommonCallback): FibORM;
            close(callback: ORMMethod__CommonCallback): FibORM;
            load(file: string, callback: ORMMethod__CommonCallback): any;
            sync(callback: ORMMethod__CommonCallback): FibORM;
            drop(callback: ORMMethod__CommonCallback): FibORM;
            /* all fixed: end */
    
            /* memeber patch: start */
            driver: PatchedOrmConnDriver
            begin: () => any
            commit: () => any
            rollback: () => any
            trans: (func: Function) => any
    
            syncSync(): void;
            
            [extraMember: string]: any;
            /* memeber patch: end */
        }
        // bad annotation but 'db' is used as like 'orm' ever, so we use 'FibOrmDB' to substitute FibORM
        type FibOrmDB = FibORM
    
        export function connectSync(opts: FibORMIConnectionOptions | string): FibOrmDB;
    
        export interface FibORMIConnectionOptions extends IConnectionOptions {
            timezone: string;
        }
    
        type AssociationKeyComputation = Function | string
        interface AssociationDefinitionOptions {
            name?: string;
            model?: FibOrmFixedModel;
            field?: OrigDetailedModelProperty
    
            // is the association is extendsTo
            extension?: boolean;
            required?: boolean;
            reversed?: boolean;
            accessor?: string;
            reverseAccessor?: string;
            autoFetch?: boolean;
            autoFetchLimit?: number;
        }
        interface InstanceAssociationItem {
            name: string;
            // is the association is extendsTo
            extension?: boolean;
    
            getAccessor: string;
            setAccessor: string;
            hasAccessor: string;
            delAccessor: string;
    
            model: FibOrmFixedModel;
            reversed: boolean;
            autoFetch: boolean;
            autoFetchLimit: number
        }
    
        interface AssociationDefinitionOptions_HasOne extends AssociationDefinitionOptions {
            reverse?: string;
        }
        interface AssociationDefinitionOptions_HasMany extends AssociationDefinitionOptions {
            reverse?: string;
            // is association property a primary key
            key?: boolean
            mergeId?: string
            mergeAssocId?: string
            reverseAssociation?: boolean

            hooks?: Hooks
            mergeTable?: string

            getAccessor?: string;
            setAccessor?: string;
            hasAccessor?: string;
            delAccessor?: string;
            addAccessor?: string;
        }
        interface InstanceAssociationItem_ExtendTos extends InstanceAssociationItem {
            field: OrigDetailedModelProperty;
            table: string;
        }
    
        interface InstanceAssociationItem_HasOne extends InstanceAssociationItem {
            field?: OrigDetailedModelProperty;
            reverse?: string;
            // template name
            accessor?: string;
            reverseAccessor?: string;
    
            required?: boolean;
            extension?: boolean;
            mapsTo?: {
                [key: string]: any;
            }
            
            addAccessor?: string;
        }
    
        interface InstanceAssociationItem_HasMany extends InstanceAssociationItem {
            props: object
            hooks: Hooks
            field: OrigDetailedModelProperty

            mergeTable: string
            mergeId: string
            mergeAssocId: string

            getAccessor: string
            setAccessor: string
            hasAccessor: string
            delAccessor: string
            addAccessor: string
        }
    
        interface InstanceOptions extends ModelOptions {
            one_associations: InstanceAssociationItem[]
            many_associations: InstanceAssociationItem[]
            extend_associations: InstanceAssociationItem[]
            association_properties: any 
            fieldToPropertyMap: any
        }
    
        interface PatchedSyncfiedModelOrInstance {
            /**
             * @important
             * 
             * methods patchSyncfied by 'fib-orm'
             */        
            countSync: Function;
            firstSync: Function;
            lastSync: Function;
            allSync: Function;
            whereSync: Function;
            findSync: Function;
            removeSync: Function;
            runSync: Function;
        }
    
        interface PatchedSyncfiedInstanceWithDbWriteOperation extends PatchedSyncfiedModelOrInstance {
            saveSync: Function;
            removeSync: Function;
            validateSync: Function;
            modelSync: Function;
        }
        interface PatchedSyncfiedInstanceWithAssociations {
            /**
             * generated by association, but you don't know what it is
             */
            /* getXxx: Function; */
            /* setXxx: Function; */
            /* removeXxx: Function; */
    
            /* findByXxx: Function; */
            [associationFunc: string]: Function;
        }
        
        // keep compatible to orig one in 'orm'
        interface OrigDetailedModelProperty extends Property {
            /**
             * text | number | integer | boolean | date | enum | object | <del>point</del> | binary | serial
             * view details in https://github.com/dresende/node-orm2/wiki/Model-Properties
             */
            type: string
            unique?: boolean
            defaultValue?: any
    
            unsigned?: boolean
            size?: number
            values?: any[]
    
            time?: boolean
    
            big?: boolean
        } 
        type OrigModelPropertyDefinition = OrigDetailedModelProperty |
            String | Boolean | Number | Date | Object | Buffer | any[]
    
        type OrigAggreteGenerator = (...args: any[]) => IAggregated
        interface OrigHooks extends Hooks {
            afterAutoFetch?: (next?) => void
        }
    
        export interface FibOrmFixedModel extends Model, OrigHooks, PatchedSyncfiedModelOrInstance {
            (): FibOrmFixedModel;// FibOrmFixedModelInstance;
            (...ids: any[]): FibOrmFixedModel;// FibOrmFixedModelInstance;
    
            new (): FibOrmFixedModelInstance;
            new (...ids: any[]): FibOrmFixedModelInstance;
            
            properties: { [property: string]: OrigDetailedModelProperty }
            allProperties: { [key: string]: OrigDetailedModelProperty }
    
            /**
             * methods used to add associations
             */
            // hasOne: (...args: any[]) => any;
            hasOne: {
                (assoc_name: string, ext_model: FibOrmFixedModel, assoc_options?: AssociationDefinitionOptions_HasOne): FibOrmFixedExtendModel
                (assoc_name: string, assoc_options?: AssociationDefinitionOptions_HasOne): FibOrmFixedExtendModel
            }
            hasMany: (...args: any[]) => any;
            extendsTo: (...args: any[]) => Model;
    
            extends: { [extendModel: string]: ExtendModelWrapper };
    
            [extraProperty: string]: any;
        }
    
        export interface ExtendModelWrapper {
            // 'hasOne', 'hasMany'
            type: string;
            reversed?: boolean;
            model: FibOrmFixedExtendModel;
        }
    
        export interface FibOrmFixedExtendModel extends FibOrmFixedModel {
            model_name: string;
        }
    
        export interface FibOrmFindLikeQueryObject {
            [key: string]: any;
        }
    
        // patch the missing field defined in orm/lib/Instance.js (such as defined by Object.defineProperty)
        export interface FibOrmFixedModelInstance extends Instance {
            /* all fixed: start */
            on(event: string, callback): FibOrmFixedModelInstance;
            save(callback?: ORMMethod__CommonCallback): Instance;
            save(data: { [property: string]: any; }, callback?: ORMMethod__CommonCallback): FibOrmFixedModelInstance;
            save(data: { [property: string]: any; }, options: any, callback?: ORMMethod__CommonCallback): FibOrmFixedModelInstance;
            saved(): boolean;
            remove(callback?: ORMMethod__CommonCallback): FibOrmFixedModelInstance;
            isInstance: boolean;
            isPersisted(): boolean;
            isShell: boolean;
            validate(callback: (errors: Error[]) => void);
            /* all fixed: end */
            
            /* missing fix: start */
            set: Function;
            markAsDirty: Function;
            dirtyProperties: object;
            __singleton_uid: string | number;
            __opts?: InstanceOptions;
            model: FibOrmFixedModel;
    
            /* missing fix: end */
    
            [extraProperty: string]: any;
        }
    
        export interface FibOrmFixedModelInstanceFn {
            (model: FibOrmFixedModel, opts: object): FibOrmFixedModelInstance
            new (model: FibOrmFixedModel, opts: object): void
        }
    
        export interface FibOrmPatchedSyncfiedInstantce extends PatchedSyncfiedInstanceWithDbWriteOperation, PatchedSyncfiedInstanceWithAssociations {
        }
    
        export interface FibOrmPatchedSyncfiedDueToAggregationInstance {
            /*  function getXxx() */
        }
    
        // export type FibOrmObjectToPatch = 
        //     FibOrmFixedModel | FibOrmFixedModelInstance 
        //     | FibOrmPatchedSyncfiedInstantce | PatchedSyncfiedInstanceWithDbWriteOperation | PatchedSyncfiedInstanceWithAssociations
    
        export interface IChainFibORMFind extends PatchedSyncfiedModelOrInstance, SqlQueryNS.SelectQuery {
            only(args: string|string[]): IChainFibORMFind;
            only(...args: string[]): IChainFibORMFind;
            order(...order: string[]): IChainFibORMFind;
        }
        /* Orm About Patch :end */
    
        /* instance/model computation/transform about :start */
        export interface ModelAutoFetchOptions {
            autoFetchLimit?: number
            autoFetch?: boolean
        }
    
        export interface InstanceAutoFetchOptions extends ModelAutoFetchOptions {
        }
    
        export interface ModelExtendOptions {
    
        }
        export interface InstanceExtendOptions extends ModelExtendOptions {
            
        }
        /* instance/model computation/transform about :end */
    
        /* query conditions :start */
        type QueryConditionInTypeType = string | number
    
        type QueryCondition_SimpleEq = { [key: string]: any }
    
        type QueryCondition_eq = QueryCondition_SimpleEq | { [key: string]: { "eq": any } }
        type QueryCondition_ne = { [key: string]: { "ne": any } }
        type QueryCondition_gt = { [key: string]: { "gt": number } }
        type QueryCondition_gte = { [key: string]: { "gte": number } }
        type QueryCondition_lt = { [key: string]: { "lt": number } }
        type QueryCondition_lte = { [key: string]: { "lte": number } }
        type QueryCondition_like = { [key: string]: { "like": string } }
        type QueryCondition_not_like = { [key: string]: { "not_like": string } }
        type QueryCondition_between = { [key: string]: { "between": [number, number] } }
        type QueryCondition_not_between = { [key: string]: { "not_between": [number, number] } }
    
        type QueryCondition_in = { [key: string]: { "in": QueryConditionInTypeType[] } }
        type QueryCondition_not_in = { [key: string]: { "not_in": QueryConditionInTypeType[] } }
    
        type QueryConditionAtomicType = 
            QueryCondition_eq | 
            QueryCondition_ne | 
            QueryCondition_gt | 
            QueryCondition_gte | 
            QueryCondition_lt | 
            QueryCondition_lte | 
            QueryCondition_like | 
            QueryCondition_not_like | 
            QueryCondition_between | 
            QueryCondition_not_between | 
            QueryCondition_in | 
            QueryCondition_not_in
    
        interface QueryConditions {
            or?: QueryConditionAtomicType[]
            [query_field: string]: QueryConditionAtomicType
        }
        // interface ReqWhere {
        //     [key: string]: QueryConditionAtomicType
        //     or?: QueryConditionAtomicType[]
        // }
        /* query conditions :end */

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

            find(): any /* Model|IChainFind */;
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
