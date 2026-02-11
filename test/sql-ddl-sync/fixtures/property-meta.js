const { describe, it, before, after } = require('test');
const assert = require('assert');
require("should");
const { useTest } = require('../hooks');

describe("property meta", function () {
	const {
		ctx,
		helpers
	} = useTest({
		database: 'sql-ddl-sync-fixture__property-meta',
		tableName: 'sql-ddl-sync-fixture__property-meta'
	});

	before(() => {
		helpers.dropDatabase();
		helpers.createDatabase();
		helpers.switchDatabase();

		helpers.dropTable();

		ctx.sync.defineCollection(ctx.tableName, {
			id     : { type: "serial" },
			name   : { type: "text", required: true },
			age    : { type: "integer", unsigned: true },
		});

		ctx.sync.sync();
	});

	if (ctx.dbdriver.type === 'mysql') {
		it('transformer', () => {
			ctx.dialect.toRawType({ mapsTo: 'abc', type: "integer", unsigned: true }, ctx.transformerCtx).typeValue.should.equal("INTEGER UNSIGNED");
		});
	}

	it('defined table existed', () => {
		ctx.sync.Dialect.hasCollectionSync(ctx.dbdriver, ctx.tableName).should.be.true();
	});

	describe('synced properties', () => {
		it('property: id', () => {
			var properties = ctx.sync.Dialect.getCollectionPropertiesSync(ctx.dbdriver, ctx.tableName);

			properties.id.serial.should.be.true();
			properties.id.key.should.be.true();
			properties.id.required.should.be.true();
			properties.id.type.should.equal('serial');
			
			properties.id.mapsTo.should.equal('id');
			if (ctx.dbdriver.type === 'mysql') {
				properties.id.unsigned.should.true();
				properties.id.size.should.equal(4);
			}
		});
		
		it('property: name', () => {
			var properties = ctx.sync.Dialect.getCollectionPropertiesSync(ctx.dbdriver, ctx.tableName);

			properties.name.required.should.be.true();
			properties.name.type.should.equal('text');
			properties.name.mapsTo.should.equal('name');
		});

		it('property: age', () => {
			var properties = ctx.sync.Dialect.getCollectionPropertiesSync(ctx.dbdriver, ctx.tableName);

			assert.isUndefined(properties.age.required);
			properties.age.type.should.equal('integer');
			properties.age.mapsTo.should.equal('age');
			if (ctx.dbdriver.type === 'mysql')
				properties.age.unsigned.should.true();
		});
	});
});
