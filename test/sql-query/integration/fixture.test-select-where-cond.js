const { describe, it, before, after } = require('test');
const assert = require('assert');
var common = require('../common')
function shared(queryOptions) {
    // fix wrong mutation of literal kvs to original where object
    var qWhere = ['table1', { "weight": { "ne": 987654321 } }];
    var qWhereInput = [ qWhere[0], { ...qWhere[1] } ];
    assert.equal(
        common.Select(queryOptions).from('table2')
            .from('table1', ['merge_id'], 'table2', ['id'])
            .where(...qWhereInput)
            .count(null, 'c')
            .build(),
        'select COUNT(*) as `c` from `table2` as `t1` inner join `table1` as `t2` on `t2`.`merge_id` = `t1`.`id` where `t2`.`weight` <> 987654321'
    )
    assert.equal(
        common.Select(queryOptions).from('table2')
            .from('table1', ['merge_id'], 'table2', ['id'])
            .where(...qWhereInput)
            .count(null, 'c')
            .build(),
        'select COUNT(*) as `c` from `table2` as `t1` inner join `table1` as `t2` on `t2`.`merge_id` = `t1`.`id` where `t2`.`weight` <> 987654321'
    )
    assert.deepEqual(qWhere, qWhereInput);
}

describe('fixtures: select where conditions', () => {
    it('mysql', () => {
        const queryOptions = { dialect: 'mysql' }
        shared(queryOptions)
    })
    it('sqlite', () => {
        const queryOptions = { dialect: 'sqlite' }
        shared(queryOptions)
    })
    it('postgresql', () => {
        const queryOptions = { dialect: 'postgresql' }
        
        var qWhere = ['table1', { "weight": { "ne": 987654321 } }];
        var qWhereInput = [ qWhere[0], { ...qWhere[1] } ];
        assert.equal(
            common.Select(queryOptions).from('table2')
                .from('table1', ['merge_id'], 'table2', ['id'])
                .where(...qWhereInput)
                .count(null, 'c')
                .build(),
            `select COUNT(*) as "c" from "table2" as "t1" inner join "table1" as "t2" on "t2"."merge_id" = "t1"."id" where "t2"."weight" <> 987654321`
        )
        assert.equal(
            common.Select(queryOptions).from('table2')
                .from('table1', ['merge_id'], 'table2', ['id'])
                .where(...qWhereInput)
                .count(null, 'c')
                .build(),
            `select COUNT(*) as "c" from "table2" as "t1" inner join "table1" as "t2" on "t2"."merge_id" = "t1"."id" where "t2"."weight" <> 987654321`
        )
        assert.deepEqual(qWhere, qWhereInput);
    })
})
