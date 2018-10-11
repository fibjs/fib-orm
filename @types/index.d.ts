/// <reference path="./orm_mirror/orm.d.ts" />

import orm from './orm_mirror/orm'

declare module "@fxjs/orm" {
    export = orm;
}