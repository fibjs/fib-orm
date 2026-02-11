// import fs = require('fs');
// import path = require('path');
// import coroutine = require('coroutine');
import chalk = require('@fibjs/chalk');
import { wrapSubcommand } from '@fibcli/make-cli';

import { Query, FxSqlQueryDialect } from '../../sql-query/Query';

const VALID_DIALECTS = ['mysql', 'sqlite', 'postgresql', 'mssql', 'dm'] as const;
const VALID_TYPES = ['sql', 'val', 'id'] as const;

const cmd = wrapSubcommand({
    name: 'escapeSQL',

    aliases: [
        'escape'
    ],

    inputs: {
        required: '<sqlstring>',
        rest: '[...args]'
    },

    examples: [],

    options: {
        '-d, --dialect-type [dialectType]': `dialect type, support ${VALID_DIALECTS.map(d => `'${d}'`).join(', ')}`,
        '-t, --type [escapeType]': `escape type, support ${VALID_TYPES.map(t => `'${t}'`).join(', ')}`,
    },

    description: `escape SQL string with given arguments`,

    onAction: ([sqlstring, , rest], options) => {
        const dialectType = options.dialectType as FxSqlQueryDialect.DialectType || 'mysql';
        if (!VALID_DIALECTS.includes(dialectType)) {
            throw new Error(`[escape] invalid dialect type: ${dialectType}`);
        }

        const escapeType = options.type as typeof VALID_TYPES[number] || 'sql';
        if (!VALID_TYPES.includes(escapeType)) {
            throw new Error(`[escape] invalid escape type: ${escapeType}`);
        }

        VALID_TYPES
        const query = new Query({ dialect: dialectType });

        switch (escapeType) {
            default:
            case 'sql': {
                const result = query.escape(sqlstring, rest);

                console.log(`dialect-type: ${chalk.blue(dialectType)}`)
                console.log(`args(${rest.length}): ${chalk.blue(rest.join(' '))}`)
                console.log()

                console.log(`input-sql: \t ${chalk.yellow(sqlstring)}`)

                console.log(`escaped-sql:\t ${chalk.green(result)}`)
                break
            }
            case 'val': {
                const result = query.escapeVal(sqlstring);

                console.log(`dialect-type: ${chalk.blue(dialectType)}`)
                // console.log(`args(${rest.length}): ${chalk.blue(rest.join(' '))}`)
                console.log()

                console.log(`input-value: \t ${chalk.yellow(sqlstring)}`)

                console.log(`escaped-value:\t ${chalk.green(result)}`)
                break
            }
            case 'id': {
                const result = query.escapeId(sqlstring);

                console.log(`dialect-type: ${chalk.blue(dialectType)}`)
                // console.log(`args(${rest.length}): ${chalk.blue(rest.join(' '))}`)
                console.log()

                console.log(`input-id: \t ${chalk.yellow(sqlstring)}`)

                console.log(`escaped-id:\t ${chalk.green(result)}`)
                break
            }
        }
    }
});

export default cmd;