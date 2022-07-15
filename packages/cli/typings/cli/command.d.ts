import type { FCli, CliCommand } from '@fxjs/cli/type';
declare type ICommandOptions = {
    [optexp: string]: string | {
        desc?: string;
        default?: string | number;
    };
};
declare type ISubCommandVarRequired<T extends string = string> = `<${T}>`;
declare type ISubCommandVarOptional<T extends string = string> = `[${T}]`;
declare type ISubCommandVarRest<T extends string = string> = `[...${T}]`;
declare type IParsedCacCommandOnAction<T extends ISubCommandOptions['inputs']> = ((args: [
    T['required'] extends (never | null | undefined) ? null : string,
    T['optional'] extends (never | null | undefined) ? null : string[],
    T['rest'] extends (never | null | undefined) ? null : string[]
], options: ({
    '--': string[];
} & Record<string, string>)) => any);
interface ISubCommandOptions {
    /** @description subcommand nmae */
    name: string;
    /** @description alias for subcommand */
    aliases?: string[];
    /** @description variable name */
    inputs?: {
        required?: ISubCommandVarRequired | undefined;
        optional?: ISubCommandVarOptional[] | undefined;
        rest?: ISubCommandVarRest | undefined;
    };
    /** @description exmaples */
    examples?: string[];
    /** @description usage cases */
    usages?: string[];
    /** @description description for subcommand */
    description?: string;
    /** @description options configuration for subcommand */
    options?: ICommandOptions;
    /** @description subcommand 的行为 */
    onAction?: IParsedCacCommandOnAction<this['inputs']>;
}
export declare function wrapSubcommand(opt: ISubCommandOptions): (cli: FCli) => CliCommand;
export {};
