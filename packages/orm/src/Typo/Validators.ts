/// <reference types="@fibjs/enforce" />

import type { FxOrmCommon } from "./_common";
import type { FxOrmNS } from "./ORM";
import type { FxOrmInstance } from "./instance";
import type { FxOrmModel } from "./model";

export namespace FxOrmValidators {
   export interface ValidatorModules {
        required: FibjsEnforce.enforcementValidation
        notEmptyString: FibjsEnforce.enforcementValidation
        rangeNumber: FibjsEnforce.enforcementValidation
        rangeLength: FibjsEnforce.enforcementValidation
        insideList: FibjsEnforce.enforcementValidation
        outsideList: FibjsEnforce.enforcementValidation
        password: FibjsEnforce.enforcementValidation

        patterns: FibjsEnforce.enforcementsContainer

        /* extra validators: start */
        equalToProperty(name: string, message?: string): FibjsEnforce.ValidationCallback;
        unique(opts?: { ignoreCase: boolean }, message?: string): FibjsEnforce.ValidationCallback;
        /* extra validators: end */
   }

   export interface IValidatorHash {
      [validation: string]: FibjsEnforce.IValidator | FibjsEnforce.IValidator[]
   }

   export interface ValidationCallback<T_THIS = any> extends FibjsEnforce.ValidationCallback {
      (value: any, next: FxOrmCommon.NextCallback, thisArg?: T_THIS, contexts?: ValidatorContext): void;
   }

   export interface ValidatorContext extends FibjsEnforce.ContextMap {
      driver: FxOrmNS.ORM['driver']
      instance: FxOrmInstance.Instance
      model: FxOrmModel.Model
   }
}