import { FxOrmHook } from './Typo/hook';
/**
 * support hook style function
 *
 * function (success: boolean) {}
 */
export declare const trigger: FxOrmHook.HookTrigger<any, any>;
/**
 * support hook style function
 *
 * function (next: Function) {}
 */
export declare const wait: FxOrmHook.HookWait;
