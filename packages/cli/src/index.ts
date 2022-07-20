#!/usr/bin/env fibjs

const pkg = require('../package.json')
import getCli = require('@fxjs/cli')

import cmdUpgrade from './commands/upgrade';
import cmdSpinner from './commands/spinner';
import cmdDDLFrom from './commands/ddlFrom';
import cmdEscape from './commands/escape';

const cli = getCli('orm-cli');

cmdUpgrade(cli);
cmdSpinner(cli);
cmdDDLFrom(cli);
cmdEscape(cli);

cli.help()
cli.version(pkg.version)

cli.parse()