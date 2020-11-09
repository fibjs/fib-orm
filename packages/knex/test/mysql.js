const assert = require('assert')

const FibKnex = require('../')

const knex = FibKnex({
    client: 'mysql',
    useNullAsDefault: true
})


describe('mysql', () => {
    it('no exception: select', () => {
        const sqlObj = knex('users')
            .select(knex.raw('count(*) as user_count, status'))
            .orWhere(knex.raw('status <> ?', [1]))
            .groupBy('status')
    })

    it('insert', () => {
        const sqlObj = knex('coords')
            .insert([{x: 20}, {y: 30}, {x: 10, y: 20}])
            
        assert.equal(
            sqlObj.toString(),
            "insert into `coords` (`x`, `y`) values (20, NULL), (NULL, 30), (10, 20)"
        )
    })

    it('escape when insert', () => {
        const sql = knex('users')
            .insert({a: 1, b: 'text', c: `what's that?`})
            .toString()

        assert.equal(sql, "insert into `users` (`a`, `b`, `c`) values (1, 'text', 'what\\'s that?')")
    })
})

