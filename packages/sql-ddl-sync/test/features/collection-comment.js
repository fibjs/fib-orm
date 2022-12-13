const test = require('test')
test.setup()

require("should");
const { useTest } = require('../hooks');

describe.only("collection comment", function () {
	const {
		ctx,
		helpers
	} = useTest({
		database: 'sql-ddl-sync-feat__collection-comment',
		tableName: 'sql-ddl-sync-feat__collection-comment'
	});

	before(() => {
		helpers.dropDatabase();
		helpers.createDatabase();
		helpers.switchDatabase();

		helpers.dropTable();

		ctx.sync.defineCollection(ctx.tableName, {
			id     : { type: "serial" },
			name   : { type: "text", required: true },
		}, {
			comment: `test table comment on ${ctx.dbdriver.type}`
		});

		ctx.sync.sync();
	});

	it(`check table comment on ${ctx.dbdriver.type}`, () => {
		if (ctx.dbdriver.type === 'mysql') {
			const comment = helpers.getTableComment(ctx.tableName);
			comment.should.equal('test table comment on mysql');
		} else if (ctx.dbdriver.type === 'postgresql') {
			const comment = helpers.getTableComment(ctx.tableName);
			comment.should.equal('test table comment on postgresql');
		} else if (ctx.dbdriver.type === 'sqlite') {
			// would throw error
		}
	});

	it(`update comment and recheck it`, () => {
		const coll = ctx.sync.findCollection(ctx.tableName);
		coll.comment = `test table comment 2 on ${ctx.dbdriver.type}`;
		ctx.sync.strategy = 'mixed';
		ctx.sync.sync();

		if (ctx.dbdriver.type === 'mysql') {
			const comment = helpers.getTableComment(ctx.tableName);
			comment.should.equal('test table comment 2 on mysql');
		} else if (ctx.dbdriver.type === 'postgresql') {
			const comment = helpers.getTableComment(ctx.tableName);
			comment.should.equal('test table comment 2 on postgresql');
		} else if (ctx.dbdriver.type === 'sqlite') {
			// would throw error
		}
	});

	it(`dont remove comment if not providing new one`, () => {
		const coll = ctx.sync.findCollection(ctx.tableName);
		coll.comment = '';
		ctx.sync.strategy = 'mixed';
		ctx.sync.sync();

		if (ctx.dbdriver.type === 'mysql') {
			const comment = helpers.getTableComment(ctx.tableName);
			comment.should.equal('test table comment 2 on mysql');
		} else if (ctx.dbdriver.type === 'postgresql') {
			const comment = helpers.getTableComment(ctx.tableName);
			comment.should.equal('test table comment 2 on postgresql');
		} else if (ctx.dbdriver.type === 'sqlite') {
			// would throw error
		}
	});
});
