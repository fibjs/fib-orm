import { FxOrmError } from "./Typo/Error";
export default class ORMError extends Error {
    static codes: FxOrmError.PredefineErrorCodes;
    name: string;
    message: string;
    code: number | string;
    literalCode: string;
    [k: string]: any;
    constructor(message: string, code?: keyof FxOrmError.PredefineErrorCodes, extras?: any);
    toString(): string;
}
