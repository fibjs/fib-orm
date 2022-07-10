const test = require('test')
test.setup()

const sqlDDLSync = require('@fxjs/sql-ddl-sync');
const { Driver: DBDriver } = require("@fxjs/db-driver");
const common = require('../common')
const protocol = common.protocol()
const config   = common.getConfig();

describe('ORM Prepare', function () {
    function makeDriver () {
        config.slashes = true;
        const connStr = DBDriver.formatUrl({ ...config, slashes: true });
        return DBDriver.create(connStr);
    }
    before(() => {
        let dbdriver
        switch (protocol) {
            case 'mysql':
                dbdriver = makeDriver();
                dbdriver.execute(`CREATE DATABASE IF NOT EXISTS \`${config.database}\``);
                break;
            case 'postgresql':
                dbdriver = makeDriver();
                dbdriver.execute(`SELECT 'CREATE DATABASE ${config.database}' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${config.database}');`);
                break;
        }

        console.notice(
            `[orm-test-prepare] common.getConnectionString() is ${common.getConnectionString()}`,
        )
    })

    it('check database exited', () => {
        // TODO
    });
})

if (require.main === module) {
  test.run(console.DEBUG)
  process.exit()
}
