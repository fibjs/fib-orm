import { FxOrmModel } from "../Typo/model";
import { FxOrmNS } from "../Typo/ORM";

export default function (
    orm: FxOrmNS.ORM,
    plugin_opts: {
        enable: boolean
    }
): FxOrmNS.Plugin {
	function beforeDefine (name: string, properties: FxOrmNS.ModelPropertyDefinitionHash, opts: FxOrmNS.ModelOptions) {
        opts.hooks = opts.hooks || {};
    }

    function define (m: FxOrmModel.Model) {
    }

    return {
        beforeDefine,
        define
    }
}