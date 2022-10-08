import type { FxOrmCommon } from './_common';
import type { FxOrmAssociation } from "./assoc";
import type { FxOrmInstance } from "./instance";
import type { FxOrmModel } from "./model";
import type { FxSqlQuerySubQuery } from "@fxjs/sql-query";
export declare namespace FxOrmSynchronous {
    interface VoidReturn {
        (): void;
    }
    interface UnknownReturn {
        (): any;
    }
    interface SynchronizedModel {
        findSync: {
            (conditions?: FxOrmModel.ModelQueryConditions__Find, options?: FxOrmModel.ModelOptions__Find): FxOrmInstance.Instance[];
            (conditions: FxOrmModel.ModelQueryConditions__Find, limit: number, order: string[]): FxOrmInstance.Instance[];
        };
        allSync: SynchronizedModel['findSync'];
        whereSync: SynchronizedModel['findSync'];
        countSync: {
            (conditions?: FxOrmModel.ModelQueryConditions__Find): number;
        };
        existsSync: {
            (...conditions: (FxOrmCommon.IdType | FxSqlQuerySubQuery.SubQueryConditions)[]): boolean;
        };
        oneSync: {
            (conditions?: FxOrmModel.ModelQueryConditions__Find, options?: FxOrmModel.ModelOptions__Find): FxOrmInstance.Instance;
            (conditions?: FxOrmModel.ModelQueryConditions__Find, order?: string[]): FxOrmInstance.Instance;
        };
        createSync: {
            (data: FxOrmInstance.InstanceDataPayload): FxOrmInstance.Instance;
            (data: FxOrmInstance.InstanceDataPayload[]): FxOrmInstance.Instance[];
        };
        getSync: {
            (...ids: any[]): FxOrmInstance.Instance;
        };
        findBySync: {
            <T = any>(ext_name: string, conditions?: FxOrmModel.ModelQueryConditions__Find, options?: FxOrmAssociation.ModelAssociationMethod__FindByOptions): FxOrmInstance.Instance[];
        };
        syncSync: VoidReturn;
        clearSync: VoidReturn;
        dropSync: UnknownReturn;
        /**
         * other patched synchronous version method
         * - lazyLoad: getXXXSync, setXXXSync, removeXXXSync
         * - association: [addAccessor]Sync, [getAccessor]Sync, [hasAccessor]Sync, [setAccessor]Sync, [removeAccessor]Sync
         */
        [ek: string]: any;
    }
    interface SynchronizedIChainFind {
    }
    interface SynchronizedORMInstance {
        syncSync: VoidReturn;
        closeSync: VoidReturn;
        dropSync: VoidReturn;
        pingSync: VoidReturn;
    }
}
