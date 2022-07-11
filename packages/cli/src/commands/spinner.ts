import logUpdate = require('@fibcli/log-update');
import cliSpinners = require('@fibcli/cli-spinners');
import { wrapSubcommand } from '@fibcli/make-cli';

const allSpinnerType = Object.keys(cliSpinners);
const DFLT_SPINNER_TYPE = 'dots';

export default wrapSubcommand({
    name: 'spinner',

    inputs: {
        optional: [
            '[text]'
        ],
    },

    examples: [],

    options: {
        '-s, --spinner-type [spinnerType]': {
            desc: `type of spinner, valid keys: ${allSpinnerType.join(', ')}`,
            default: DFLT_SPINNER_TYPE
        },
    },

    description: `just run spinner`,

    onAction: ([, [ text ]], options) => {
        text = text || ' Unicorns'

        let spinnerType = options.spinnerType;
        if (!spinnerType || allSpinnerType.indexOf(spinnerType) === -1) {
            console.warn(`[spinner] type '${spinnerType}' invalid, correct to ${DFLT_SPINNER_TYPE}`)
            spinnerType = DFLT_SPINNER_TYPE;
        }
        const spinner = cliSpinners[spinnerType];
        let i = 0;

        setInterval(() => {
            const {frames} = spinner;
            logUpdate(`${frames[i = ++i % frames.length]}${text}`);
        }, spinner.interval);
    }
});