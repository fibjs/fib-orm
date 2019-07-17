const test = require('test')
test.setup()

var common  = require("../common");
var Sync = require('../../').Sync;

const testDefinitions = [
	[
		'user', {
			id: { type: "serial", key: true, serial: true },
			username: { type: "text", reuqired: true },
			password: { type: "text", reuqired: true },
			created_at: { type: "datetime", defaultValue: 'CURRENT_TIMESTAMP' },
		}
	],
	[
		'person', {
			id: { type: "serial", key: true, serial: true },
			age: { type: "integer" },
			email: { type: "text", size: 256 },
			phone: { type: "text", size: 32 },
			birthday: { type: "date", time: true, defaultValue: new Date('1970-01-01 00:00:00') },
			photo: { type: "binary" },
			created_at: { type: "datetime", defaultValue: 'CURRENT_TIMESTAMP' },
		}
	],
	[
		'role', {
			id: { type: "serial", key: true, serial: true },
			name: { type: "text", reuqired: true },
			description: { type: "text", reuqired: true },
			created_at: { type: "datetime", defaultValue: 'CURRENT_TIMESTAMP' },
		}
	],
	[
		'subject', {
			id: { type: "serial", key: true, serial: true },
			type: { type: "text", reuqired: true, index: [ "subject_idx_type_position" ] },
			position: { type: "text", reuqired: true, index: [ "subject_idx_type_position" ] },
			description: { type: "text", reuqired: true, index: [ "subject_idx_description" ] },
			created_at: { type: "datetime", defaultValue: 'CURRENT_TIMESTAMP' },
		}
	]
];

const allTables = {}
const allTableNames = testDefinitions.map(([table, props]) => {
	allTables[table] = props;

	return table
})


odescribe(`db: Sync`, function () {
	var sync = null

	before(common.dropTable(allTableNames))

	describe("1st Syncing", function () {
		before(() => {
			sync = new Sync({
				dbdriver: common.dbdriver,
				debug   : function (text) {
					process.env.DEBUG_SYNC && console.notice("> %s", text);
				}
			});

			testDefinitions.forEach(([table, properties]) => {
				sync.defineCollection(table, {
					...properties
				});
			});

			sync.sync();
		});

		allTableNames.forEach(table => {
			describe(`db should have table '${table}'`, function () {
				var allColumns = Object.keys(allTables[table]);

				it('table exists', () => {
					assert.equal(
						sync.Dialect.hasCollectionSync(
							sync.dbdriver,
							table
						),
						true
					)
				});

				allColumns.forEach(colName => {
					it(`${table} should have column '${colName}'`, () => {
						assert.equal(
							sync.Dialect.hasCollectionColumnsSync(
								sync.dbdriver,
								table,
								colName
							),
							true
						)
					});
				});

				it(`${table} should have columns '${allColumns.join("', '")}'`, () => {
					assert.equal(
						sync.Dialect.hasCollectionColumnsSync(
							sync.dbdriver,
							table,
							allColumns
						),
						true
					)
				});

				it(`${table}'s column 'created_at' should have default value`, () => {
					const created_at = 
						sync.Dialect.getCollectionPropertiesSync(
							sync.dbdriver,
							table,
							'created_at'
						).created_at

					assert.equal(created_at.defaultValue, 'CURRENT_TIMESTAMP')
				});
			});
		});
	});

	describe("Syncing when remote db existed", function () {
		before(() => {
			sync = new Sync({
				dbdriver: common.dbdriver,
				debug   : function (text) {
					process.env.DEBUG_SYNC && console.notice("> %s", text);
				}
			});

			testDefinitions.forEach(([table, properties]) => {
				sync.defineCollection(table, {
					...properties,
					updated_at: { type: "date", time: true, defaultValue: new Date() },
					expired_at: { type: "date", time: true, defaultValue: new Date() },
				});

				// sync.syncCollection(table);
				sync.sync();
			});
		});

		allTableNames.forEach(table => {
			describe(`db should have table '${table}'`, function () {
				var addedColumns = ['updated_at', 'expired_at'];

				it('table exists', () => {
					assert.equal(
						sync.Dialect.hasCollectionSync(
							sync.dbdriver,
							table
						),
						true
					)
				});

				addedColumns.forEach(colName => {
					it(`${table} should have column '${colName}'`, () => {
						assert.equal(
							sync.Dialect.hasCollectionColumnsSync(
								sync.dbdriver,
								table,
								colName
							),
							true
						)
					});
				});

				it(`${table} should have columns '${addedColumns.join("', '")}'`, () => {
					assert.equal(
						sync.Dialect.hasCollectionColumnsSync(
							sync.dbdriver,
							table,
							addedColumns
						),
						true
					)
				});

				if (common.dialect === 'sqlite') {
					it(`${table}'s column 'updated_at' have no default value`, () => {
						const props = sync.Dialect.getCollectionPropertiesSync(
							sync.dbdriver,
							table,
							'updated_at'
						)

						assert.notExist(props.updated_at.defaultValue)
						assert.notExist(props.expired_at.defaultValue)
					});
				} else {
					it(`${table}'s column 'updated_at' should have default value`, () => {
						const props = sync.Dialect.getCollectionPropertiesSync(
							sync.dbdriver,
							table,
							'updated_at'
						)

						assert.exist(props.updated_at.defaultValue)
						assert.exist(props.expired_at.defaultValue)
					});
				}
			});
		});
	});

	xdescribe("Syncing with modification when remote db existed", function () {
		before(() => {
			sync = new Sync({
				dbdriver: common.dbdriver,
				debug   : function (text) {
					process.env.DEBUG_SYNC && console.notice("> %s", text);
				}
			});

			testDefinitions.forEach(([table, properties]) => {
				sync.defineCollection(table, {
					...properties,
					id: { type: "text", key: false, serial: false },
				});

				sync.syncCollection(table);
			});
		});
	});
});

if (require.main === module) {
  test.run(console.DEBUG)
}