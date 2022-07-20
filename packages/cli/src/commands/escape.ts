// import fs = require('fs');
// import path = require('path');
// import coroutine = require('coroutine');
import chalk = require('@fibjs/chalk');
import { wrapSubcommand } from '@fibcli/make-cli';

import { Query, FxSqlQueryDialect } from '@fxjs/sql-query';

const validDialects = ['mysql', 'sqlite', 'postgresql', 'mssql'] as const;

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
        '-d, --dialect-type [dialectType]': `dialect type, support ${validDialects.map(d => `'${d}'`).join(', ')}`,
    },

    description: `escape SQL string with given arguments`,

    onAction: ([sqlstring, , rest], options) => {
        const dialectType = options.dialectType as FxSqlQueryDialect.DialectType || 'mysql';

        if (!validDialects.includes(dialectType)) {
            throw new Error(`[escape] invalid dialect type: ${dialectType}`);
        }
        const query = new Query({ dialect: dialectType });

        const result = query.escape(sqlstring, rest);

        console.log(`dialect-type: ${chalk.blue(dialectType)}`)
        console.log(`args(${rest.length}): ${chalk.blue(rest.join(' '))}`)
        console.log()

        console.log(`input-sql: \t ${chalk.yellow(sqlstring)}`)

        console.log(`escaped-sql:\t ${chalk.green(result)}`)
    }
});

export default cmd;