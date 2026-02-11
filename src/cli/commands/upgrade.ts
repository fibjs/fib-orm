import child_process = require('child_process')
import chalk = require('@fibjs/chalk')
import ora from '@fibcli/ora'
import { wrapSubcommand } from "@fibcli/make-cli";
import { checkUpgrade, parsePkgInfo } from '../helpers/package';

const LOGPREFIX = `[upgrade]`;

export default wrapSubcommand({
    name: 'upgrade',

    aliases: [],

    inputs: {
        optional: [
        ],
    },

    examples: [],

    options: {
    },

    description: `check & upgrade orm cli to latest version.`
    ,

    onAction: ([]) => {
        const pkgInfo = parsePkgInfo();

        const checkResult = checkUpgrade({
            pkgCurrentVersion: '1.3.0', // leave here to debug
            // pkgCurrentVersion: pkgInfo.version,
        });

        if (checkResult.errCode) {
            console.log(`${chalk.blue(LOGPREFIX)} check upgrade failed!`)
            console.error(checkResult.message)
            return ;
        }

        const result = checkResult.result;

        console.log();
        console.log(`${chalk.blue(LOGPREFIX)} local  version : ${chalk.green(result.currentVersion)}`)
        console.log(`${chalk.blue(LOGPREFIX)} latest version : ${chalk.green(result.latestVersion)}`)

        if (result.needUpgrade) {            
            console.log();
            let answer = console.readLine('will you upgrade to latest version for you, confirm? (Y/N)')

            answer = answer || 'N'
            
            const upgradeSpinner = ora({});

            switch (answer) {
                case 'Y':
                case 'y':
                case 'Yes':
                    console.log(`${chalk.blue(LOGPREFIX)} will upgrade for you...`)
                    console.log()
                    upgradeSpinner.color = 'green';
                    upgradeSpinner.text = `${chalk.blue(LOGPREFIX)} upgrading...`;
                    upgradeSpinner.start()
                    require('coroutine').sleep(1000);
                    child_process.run('npm i -g fib-orm')
                    upgradeSpinner.stop()
                    // need to upgrade to latest version

                    console.log();
                    console.log(`${chalk.blue(LOGPREFIX)} upgrade finished`)
                    break;
                case 'N':
                case 'n':
                case 'No':
                default:
                    console.log(`${chalk.blue(LOGPREFIX)} nothing to do.`)
                    break;
            }
        } else {
            console.log(chalk.green`${chalk.blue(LOGPREFIX)} orm-cli installation is up-to date!`)
        }
    }
});