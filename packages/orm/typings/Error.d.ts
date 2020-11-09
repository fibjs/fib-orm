import { FxOrmError } from "./Typo/Error";
declare const _default: {
    new (message: string, code?: keyof FxOrmError.PredefineErrorCodes, extras?: any): {
        [k: string]: any;
        name: string;
        message: string;
        code: number | string;
        literalCode: string;
        toString(): string;
        stack?: string;
    };
    codes: FxOrmError.PredefineErrorCodes;
};
export = _default;
