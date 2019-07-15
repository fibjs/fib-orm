var common  = require("../common");
var Driver = require("../..").getDriver('mysql');

describe("SQLite", function () {
	describe("basic operation", () => {
		var driver
		var knex
		var DBNAME = 'fxjs-db-driver-test';
		before(() => {
			driver = Driver.create('mysql://root:@localhost:3306');
			knex = common.getKnexInstance(driver);

			driver.open()

			driver.execute('CREATE DATABASE IF NOT EXISTS `' + DBNAME + '`;')
		})

		after(() => {
			driver.execute('DROP DATABASE IF EXISTS `' + DBNAME + '`;')
		})

		it("#open, #ping, #close, re-open", () => {
			driver.open()

			driver.ping()

			driver.close()
		});

		it('#execute', () => {
			driver.reopen()

			driver.switchDb(DBNAME)

			driver.execute(
				knex.schema.dropTableIfExists('users').toString()
			)

			assert.deepEqual(
				driver.execute(
					knex.schema.createTable('users', function (table) {
						table.increments();
						table.string('name');
						table.timestamps();
					}).toString()
				),
				[]
			);

			// has table `users`
			assert.deepEqual(
				driver.execute(
					knex.schema.hasTable('users').toString()
				).filter(row => row.TABLE_NAME === 'users').length === 1,
				true,
			);

			// has col `id`
			assert.deepEqual(
				driver.execute(
					knex.schema.hasColumn('users', 'id').toString()
				).filter(row => row.Field === 'created_at').length === 1,
				true 
			)

			// has col `created_at`
			assert.deepEqual(
				driver.execute(
					knex.schema.hasColumn('users', 'created_at').toString()
				).filter(row => row.Field === 'created_at').length === 1,
				true
			)

			// has col `updated_at`
			assert.deepEqual(
				driver.execute(
					knex.schema.hasColumn('users', 'updated_at').toString()
				).filter(row => row.Field === 'updated_at').length === 1,
				true
			)

			// now drop table `users`
			assert.deepEqual(
				driver.execute(
					knex.schema.dropTable('users').toString()
				),
				[]
			)
		})
	})
})