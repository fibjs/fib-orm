/// <reference types="@fibjs/types" />

import { FxOrmSqlDDLSync__Column } from "./Typo/Column";
import { FxOrmSqlDDLSync } from "./Typo/_common";

import { FxDbDriverNS } from "@fxjs/db-driver/typings/Typo";
import { FxOrmSqlDDLSync__Collection } from "./Typo/Collection";
import { IDbDriver } from "@fxjs/db-driver";

export function logJson (group: string, detail: any) {
    let json = null;
    try {
        json = JSON.stringify(detail, null, '\t');
    } catch (e) {
        throw 'Error occured when trying to log detail';
    }
    
    if (process.env.DEBUG)
        console.notice(json)

    return json
}

export function getSqlQueryDialect (type: FxDbDriverNS.DriverType) {
    const Dialects = require('@fxjs/sql-query/lib/Dialects')

	return Dialects[type];
}

export function arraify<T = any> (item: T | T[]): T[] {
	return Array.isArray(item) ? item : [item]
}

export function getCollectionMapsTo_PropertyNameDict (collection: FxOrmSqlDDLSync__Collection.Collection) {
    const hash = <{[k: string]: string}>{}

    Object.keys(collection.properties).forEach(pname => {
        const prop = collection.properties[pname]
        if (prop.mapsTo)
            hash[prop.mapsTo] = pname
    })

    return hash;
}

export function filterPropertyDefaultValue (
    property: FxOrmSqlDDLSync__Column.Property,
    ctx: {
        collection: string,
        property: FxOrmSqlDDLSync__Column.Property,
        driver: IDbDriver
    }
) {
    let _dftValue
    if (property.hasOwnProperty('defaultValue'))
        if (typeof property.defaultValue === 'function') {
            _dftValue = property.defaultValue(ctx)
        } else
            _dftValue = property.defaultValue

    return _dftValue
}

export function filterSyncStrategy (
    strategy: FxOrmSqlDDLSync.SyncCollectionOptions['strategy']
) {
    switch (strategy) {
        case 'hard':
        case 'soft':
        case 'mixed':
            break
        default:
            strategy = 'soft'
            break
    }
    return strategy
}

export function filterSuppressColumnDrop (
    suppressColumnDrop: boolean, db_type: FxDbDriverNS.DriverType
) {
    if (db_type === 'sqlite')
        return true

    return !!suppressColumnDrop
}