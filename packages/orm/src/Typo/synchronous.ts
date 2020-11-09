import type { FxOrmCommon } from './_common';
import type { FxOrmAssociation } from "./assoc";
import type { FxOrmInstance } from "./instance";
import type { FxOrmModel } from "./model";
import type { FxOrmError } from "./Error";

import type { FxSqlQuerySubQuery } from "@fxjs/sql-query";

export namespace FxOrmSynchronous {
    export interface VoidReturn {
        (): void
    }
    export interface UnknownReturn {
        (): any
    }

    export interface SynchronizedModel {
        findSync: {
            (conditions?: FxOrmModel.ModelQueryConditions__Find, options?: FxOrmModel.ModelOptions__Find): FxOrmInstance.Instance[]
            (conditions: FxOrmModel.ModelQueryConditions__Find, limit: number, order: string[]): FxOrmInstance.Instance[]
        }
        allSync: SynchronizedModel['findSync']
        whereSync: SynchronizedModel['findSync']

        countSync: {
            (conditions?: FxOrmModel.ModelQueryConditions__Find): number;
        }
        existsSync: {
            (...conditions: (FxOrmCommon.IdType | FxSqlQuerySubQuery.SubQueryConditions)[]): boolean
        }
        oneSync: {
            (conditions?: FxOrmModel.ModelQueryConditions__Find, options?: FxOrmModel.ModelOptions__Find): FxOrmInstance.Instance
            (conditions?: FxOrmModel.ModelQueryConditions__Find, order?: string[]): FxOrmInstance.Instance
        }

        createSync: {
            (data: FxOrmInstance.InstanceDataPayload): FxOrmInstance.Instance;
            (data: FxOrmInstance.InstanceDataPayload[]): FxOrmInstance.Instance[];
        }
        getSync: {
            (...ids: any[]): FxOrmInstance.Instance; // this Instance is from its callback
        }
        findBySync: {
            <T = any>(
                ext_name: string,
                conditions?: FxOrmModel.ModelQueryConditions__Find,
                options?: FxOrmAssociation.ModelAssociationMethod__FindByOptions,
            ): FxOrmInstance.Instance[]
        }

        // it's callback version could return `this: ORM`
        syncSync: VoidReturn
        clearSync: VoidReturn
        dropSync: UnknownReturn

        /**
         * other patched synchronous version method
         * - lazyLoad: getXXXSync, setXXXSync, removeXXXSync
         * - association: [addAccessor]Sync, [getAccessor]Sync, [hasAccessor]Sync, [setAccessor]Sync, [removeAccessor]Sync
         */
        [ek: string]: any
    }

    export interface SynchronizedInstance {
        saveSync: {
            (data?: FxOrmInstance.InstanceDataPayload, options?: FxOrmInstance.SaveOptions): FxOrmInstance.Instance
        }
        removeSync: {
            (): void
        }
        validateSync: {
            (): false | FxOrmError.ExtendedError[]
        }
        /**
         * other patched synchronous version method
         * - lazyLoad: getXXXSync, setXXXSync, removeXXXSync
         * - association: [addAccessor]Sync, [getAccessor]Sync, [hasAccessor]Sync, [setAccessor]Sync, [removeAccessor]Sync
         */
        [ek: string]: any
    }

    // TODO: to implement it.
    export interface SynchronizedIChainFind {

    }

    export interface SynchronizedORMInstance {
        // it's callback version could return `this: ORM`
        syncSync: VoidReturn
        closeSync: VoidReturn
        dropSync: VoidReturn
        pingSync: VoidReturn
    }
}