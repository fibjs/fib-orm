#!/usr/bin/env fibjs

const pkg = require('../package.json')
import getCli = require('@fxjs/cli')

import cmdSpinner from './commands/spinner';

const cli = getCli('orm-cli');

cmdSpinner(cli);

cli.help()
cli.version(pkg.version)

cli.parse()