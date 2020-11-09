/// <reference types="@fibjs/types" />
import { FxOrmCommon } from './_common';
import type { FxOrmInstance } from './instance';
export declare namespace FxOrmHook {
    export interface HookActionNextFunction<TTHIS = FxOrmInstance.Instance> {
        (this: TTHIS, err?: Error | null): any;
    }
    export interface HookActionCallback<TTHIS = FxOrmInstance.Instance, TPAYLOAD = any> {
        (this: TTHIS, next?: HookActionNextFunction): any;
        (this: TTHIS, arg1?: TPAYLOAD, next?: HookActionNextFunction): any;
    }
    export interface HookResultCallback<TTHIS = FxOrmInstance.Instance, TPAYLOAD = any> {
        (this: TTHIS, success?: boolean): any;
        (this: TTHIS, arg1?: TPAYLOAD, success?: boolean): any;
    }
    export interface HookTrigger<CTX_SELF = FxOrmInstance.Instance, RESULT_TYPE = boolean> {
        (self: CTX_SELF, cur: FxOrmCommon.Arraible<HookResultCallback>, _?: RESULT_TYPE, ...args: any): void;
    }
    export interface HookWait<CTX_SELF = FxOrmInstance.Instance, TNEXT_THIS = any> {
        (self: CTX_SELF, cur: FxOrmCommon.Arraible<HookActionCallback | FxOrmCommon.Arraible<HookActionCallback>>, next: FxOrmCommon.GenericCallback<TNEXT_THIS>, opts?: Fibjs.AnyObject): void;
    }
    export interface HookPatchOptions {
        /**
         * @default false
         * 'prepend': prepend old oldhook to new hook
         * 'append': append old oldhook to new hook
         * undefined: overwrite oldhook
         */
        oldhook?: 'prepend' | 'append' | 'initial' | 'overwrite' | undefined;
    }
    export interface HookChannel<FTYPE = Function> {
        (name: string, handler: FTYPE): HookChannelResults;
        (handler: FTYPE): HookChannelResults;
        (name?: string): HookChannelResults;
    }
    type HookTuple<FTYPE = Function> = [FTYPE, (fn: FTYPE, ...args: any) => any];
    export interface HookChannelResults<FTYPE = Function> extends HookTuple<FTYPE> {
        run: (...args: any) => any;
        set: (fn: Function, ...args: any) => any;
    }
    export {};
}
