const { describe, it, before, after, xit } = require('test');
const assert = require('assert');
var common = require('../common')
describe('update', () => {
  it('update - mysql', () => {
	  const queryOptions = { dialect: 'mysql' };

    assert.equal(
      common.Update(queryOptions).into('table1').set({ col: 1 }).build(),
      "update `table1` set `col` = 1"
    )

    assert.equal(
      common.Update(queryOptions).into('table1').set({ col1: 1, col2: 2 }).build(),
      "update `table1` set `col1` = 1, `col2` = 2"
    )

    assert.equal(
      common.Update(queryOptions).into('table1').set({ col1: 1, col2: 2 }).where({ id: 3 }).build(),
      "update `table1` set `col1` = 1, `col2` = 2 where `id` = 3"
    )
  })

  it('update - postgresql', () => {
	  const queryOptions = { dialect: 'postgresql' };

    assert.equal(
      common.Update(queryOptions).into('table1').set({ col: 1 }).build(),
      'update "table1" set "col" = 1'
    )

    assert.equal(
      common.Update(queryOptions).into('table1').set({ col1: 1, col2: 2 }).build(),
      'update "table1" set "col1" = 1, "col2" = 2'
    )

    assert.equal(
      common.Update(queryOptions).into('table1').set({ col1: 1, col2: 2 }).where({ id: 3 }).build(),
      'update "table1" set "col1" = 1, "col2" = 2 where "id" = 3'
    )
  })

  it('update - sqlite', () => {
	  const queryOptions = { dialect: 'sqlite' };

    assert.equal(
      common.Update(queryOptions).into('table1').set({ col: 1 }).build(),
      "update `table1` set `col` = 1"
    )

    assert.equal(
      common.Update(queryOptions).into('table1').set({ col1: 1, col2: 2 }).build(),
      "update `table1` set `col1` = 1, `col2` = 2"
    )

    assert.equal(
      common.Update(queryOptions).into('table1').set({ col1: 1, col2: 2 }).where({ id: 3 }).build(),
      "update `table1` set `col1` = 1, `col2` = 2 where `id` = 3"
    )
  })

  xit('update - mssql', () => {
	  const queryOptions = { dialect: 'mssql' };

    assert.equal(
      common.Update(queryOptions).into('table1').set({ col: 1 }).build(),
      "update [table1] set [col] = 1;select @@rowcount"
    )

    assert.equal(
      common.Update(queryOptions).into('table1').set({ col1: 1, col2: 2 }).build(),
      "update [table1] set [col1] = 1, [col2] = 2;select @@rowcount"
    )

    assert.equal(
      common.Update(queryOptions).into('table1').set({ col1: 1, col2: 2 }).where({ id: 3 }).build(),
      "update [table1] set [col1] = 1, [col2] = 2 where [id] = 3;select @@rowcount"
    )
  })
})
