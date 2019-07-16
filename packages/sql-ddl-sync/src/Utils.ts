/// <reference types="@fibjs/types" />


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

export function getDialect (type: FxDbDriverNS.DriverType) {
    const Dialects = require('@fxjs/sql-query/lib/Dialects')

	return Dialects[type];
}
