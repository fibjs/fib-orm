/// <reference types="@fibjs/types" />
/// <reference types="@fxjs/orm-core" />

/// <reference path="_common.d.ts" />
/// <reference path="SQL.d.ts" />
/// <reference path="Collection.d.ts" />
/// <reference path="DbIndex.d.ts" />
/// <reference path="Driver.d.ts" />
/// <reference path="Column.d.ts" />
/// <reference path="Query.d.ts" />

declare namespace FxDbDriverNS {

    interface ExportModule {
        Driver: typeof FxDbDriver__Driver.Driver
        SQLDriver: typeof FxDbDriver__Driver.Driver
    }
}

declare module "@fxjs/sql-ddl-sync" {
    const mod: FxDbDriverNS.ExportModule
    export = mod
}