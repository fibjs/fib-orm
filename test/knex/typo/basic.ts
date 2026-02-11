import FKnex = require('../../');

var knex = FKnex({
    client: 'sqlite'
})

knex.orWhere
knex.andWhere

var qbuilder = knex.queryBuilder()
var sbuilder = knex.schema

knex.batchInsert
