import { FxOrmNS } from "../Typo/ORM";
export default function (orm: FxOrmNS.ORM, plugin_opts: {
    enable: boolean;
}): FxOrmNS.Plugin;
