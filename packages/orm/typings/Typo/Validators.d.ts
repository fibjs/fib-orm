/// <reference types="@fibjs/enforce" />
import type { FxOrmCommon } from "./_common";
import type { FxOrmNS } from "./ORM";
import type { FxOrmInstance } from "./instance";
import type { FxOrmModel } from "./model";
export declare namespace FxOrmValidators {
    interface ValidatorModules {
        required: FibjsEnforce.enforcementValidation;
        notEmptyString: FibjsEnforce.enforcementValidation;
        rangeNumber: FibjsEnforce.enforcementValidation;
        rangeLength: FibjsEnforce.enforcementValidation;
        insideList: FibjsEnforce.enforcementValidation;
        outsideList: FibjsEnforce.enforcementValidation;
        password: FibjsEnforce.enforcementValidation;
        patterns: FibjsEnforce.enforcementsContainer;
        equalToProperty(name: string, message?: string): FibjsEnforce.ValidationCallback;
        unique(opts?: {
            ignoreCase: boolean;
        }, message?: string): FibjsEnforce.ValidationCallback;
    }
    interface IValidatorHash {
        [validation: string]: FibjsEnforce.IValidator | FibjsEnforce.IValidator[];
    }
    interface ValidationCallback<T_THIS = any> extends FibjsEnforce.ValidationCallback {
        (value: any, next: FxOrmCommon.NextCallback, thisArg?: T_THIS, contexts?: ValidatorContext): void;
    }
    interface ValidatorContext extends FibjsEnforce.ContextMap {
        driver: FxOrmNS.ORM['driver'];
        instance: FxOrmInstance.Instance;
        model: FxOrmModel.Model;
    }
}
