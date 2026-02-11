const { describe, it, before, after } = require('test');
const assert = require('assert');
var common = require('../common')
describe('select-aggregate-groupby', () => {
  it('select-aggregate-groupby', () => {
    assert.equal(
      common.Select().from('table1').max('col1').groupBy('col1').build(),
    //   'SELECT MAX(`col1`) FROM `table1` GROUP BY `col1`'
	'select MAX(`col1`) from `table1` group by `col1`'
    )

    assert.equal(
      common.Select().from('table1').avg().max('col1').groupBy('col1', '-col2').build(),
    //   'SELECT AVG(MAX(`col1`)) FROM `table1` GROUP BY `col1`, `col2` ORDER BY `col2` DESC'
	'select AVG(MAX(`col1`)) from `table1` group by `col1`, `col2` order by `col2` DESC'
    )
  })
})
