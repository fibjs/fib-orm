import util = require("util");
import tty  = require("tty");

import { FxOrmDMLDriver } from "./Typo/DMLDriver";

export function sql (driver: FxOrmDMLDriver.DMLDriver, sql: string) {
	var fmt: string;

	if (tty.isatty(process.stdout.fd)) {
		fmt = "\x1b[32;1m(orm/%s) \x1b[34m%s\x1b[0m\n";
		sql = sql.replace(/`(.+?)`/g, function (m) { return "\x1b[31m" + m + "\x1b[34m"; });
	} else {
		fmt = "[SQL/%s] %s\n";
	}

	process.stdout.write(
		util.format(fmt, driver, sql) as any
	);
};
