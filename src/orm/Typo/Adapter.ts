export namespace FxOrmAdapter {
    export interface AddAdapatorFunction {
        (name: string, constructor: Function): void
    }
}