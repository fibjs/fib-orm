const assert = require('assert')

const FibKnex = require('../')

const knex = FibKnex({
    client: 'sqlite',
    useNullAsDefault: true
})


describe('sqlite', () => {
    it('no exception: select', () => {
        const sqlObj = knex('users')
            .select(knex.raw('count(*) as user_count, status'))
            // .where(knex.raw(1))
            .orWhere(knex.raw('status <> ?', [1]))
            .groupBy('status')
    })

    it('escape when insert', () => {
        const sql = knex('users')
            .insert({a: 1, b: 'text', c: `what's that?`})
            .toString()

        assert.equal(sql, "insert into `users` (`a`, `b`, `c`) values (1, 'text', 'what''s that?')")
    })
})

