/// <reference types="@fibjs/types" />

import util = require('util');
// import debug = require('debug');

// const groups = {
//     'createCollection': debug('@fxjs/sql-ddl-sync:createCollection')
// } as { [k: string]: debug.Debugger }

export function logJson (group: string, detail: any) {
    let json = null;
    try {
        json = JSON.stringify(detail, null, '\t');
    } catch (e) {
        throw 'Error occured when trying to log detail';
    }
    
    if (process.env.DEBUG)
        console.notice(json)

    // if (process.env.DEBUG && groups[group])
    //     groups[group](json);

    return json
}
