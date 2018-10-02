/// <reference path="./orm_mirror/orm.d.ts" />
/// <reference path="./3rd.d.ts" />

import OrmNS = require('@fxjs/orm')
import SqlQueryNS from 'sqlquery'

type Buffer = Class_Buffer

declare module "@fxjs/orm" {
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

    export interface FibOrmFixedModelOptions /* extends OrmNS.ModelOptions */ {
        id?: string[];
        autoFetch?: boolean;
        autoFetchLimit?: number;
        cacheFetch?: boolean;
        hooks?: OrmNS.Hooks;
        methods?: { [name: string]: Function };

        [extensibleProperty: string]: any;
    }

    export interface FibORM extends OrmNS.ORM {
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

    export function connectSync(opts: OrmNS.FibORMIConnectionOptions | string): FibOrmDB;

    export interface FibORMIConnectionOptions extends OrmNS.IConnectionOptions {
        timezone: string;
    }

    type AssociationKeyComputation = Function | string
    interface AssociationDefinitionOptions {
        name?: string;
        model?: FibOrmFixedModel;
        field?: OrigDetailedModelProperty

        // is the association is extendsTo
        extension?: boolean;
        reversed?: boolean
        accessor?: string
        reverseAccessor?: string
        autoFetch?: boolean
        autoFetchLimit?: number
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
        addAccessor?: string;
    }

    interface InstanceOptions extends OrmNS.ModelOptions {
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
    interface OrigDetailedModelProperty extends OrmNS.Property {
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

    type OrigAggreteGenerator = (...args: any[]) => OrmNS.IAggregated
    interface OrigHooks extends OrmNS.Hooks {
        afterAutoFetch?: (next?) => void
    }

    export interface FibOrmFixedModel extends OrmNS.Model, OrigHooks, PatchedSyncfiedModelOrInstance {
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
        extendsTo: (...args: any[]) => OrmNS.Model;

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
    export interface FibOrmFixedModelInstance extends OrmNS.Instance {
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
}
