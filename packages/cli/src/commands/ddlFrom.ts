import fs = require('fs');
import path = require('path');
import coroutine = require('coroutine');
import { wrapSubcommand } from '@fibcli/make-cli';

import { Driver } from '@fxjs/db-driver';
import { Sync } from '@fxjs/sql-ddl-sync';

export default wrapSubcommand({
    name: 'ddlFrom',

    aliases: [
        'ddlfrom'
    ],

    inputs: {
        required: '<connection>',
        optional: [
            '[tableName]'
        ]
    },

    examples: [],

    options: {
        '-P, --pool [pool]': 'whether use connection pool or not',
        '-O, --out [outPath]': 'path to output json file',
    },

    description: `read columns information from database, and generate ddl file`,

    onAction: ([connection, [tableName]], options) => {
        const driver = Driver.create(connection);
        const sync = new Sync({ dbdriver: driver });

        let outJson: string = '';
        if (options.out) {
            if ((options.out as any) === true) {
                outJson = `./${driver.type}-${
                    driver.config.database.replace(/[\.|\/]/g, '_')
                }.json`;
            } else if (typeof options.out === 'string') {
                outJson = options.out;
            }
            
            if (outJson) {
                outJson = path.resolve(process.cwd(), outJson);
            }
        }

        let tableNames = [] as string[];
        if (tableName) {
            if (!sync.Dialect.hasCollectionSync(driver, tableName))
                throw new Error(`[ddlFrom] table ${tableName} doen't exist!`);

            tableNames = [tableName];
        }

        switch (driver.type) {
            case 'psql':
                if (!tableName) {
                    const result = driver.execute<{
                        table_schema: string;
                        table_name: string
                    }[]>('SELECT * FROM information_schema.tables');
                    result.forEach((x) => {
                        // skip system tables
                        if (x.table_name.startsWith('pg_')) return ;
                        // skip non public tables
                        if (x.table_schema !== 'public') return ;

                        tableNames.push(x.table_name);
                    });
                }
                break;
            case 'mysql':
                if (!tableName) {
                    const result = driver.execute<{ [k: string]: string }[]>('show tables;');
                    tableNames = result.reduce((accu, x) => (
                        accu.push(Object.entries(x)[0][1]),
                        accu
                    ), [] as string[]);   
                }
                break;
            case 'sqlite':
                if (!tableName) {
                    const result = driver.execute<{ name: string }[]>(`SELECT name FROM sqlite_schema WHERE type='table' ORDER BY name
                    `);
                    result.forEach((x) => {
                        // skip system tables
                        if (x.name.startsWith('sqlite_')) return ;

                        tableNames.push(x.name);
                    });
                }
                break;
            default:
                if (!tableName) {
                    throw new Error('[ddlFrom] tableName is required!')
                }
                tableNames = [tableName];
        }

        const tableDDL = [] as {
            collection: string,
            rawColumns: any[]
            properties: any,
        }[];
        coroutine.parallel(tableNames, tableName => {
            tableDDL.push(
                {
                    collection: tableName,
                    properties: sync.Dialect.getCollectionPropertiesSync(driver, tableName),
                    rawColumns: sync.Dialect.getCollectionColumnsSync(driver, tableName),
                }
            )
        });

        tableDDL.sort((a, b) => a.collection < b.collection ? -1 : 1);

        if (outJson) {
            console.notice(`[ddlFrom] try to write to ${outJson}...`);
            fs.writeFile(outJson, JSON.stringify(tableDDL, null, 2) as any);
            console.notice(`[ddlFrom] write json to ${outJson} success!`);
        } else {
            console.log('[ddlFrom] tableDDL\n', JSON.stringify(tableDDL, null, 2));
        }
    }
});