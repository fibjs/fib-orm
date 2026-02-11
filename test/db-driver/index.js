const { describe, it, before, after } = require('test');
const assert = require('assert');
;[
    [0, { ENTRY_SUFFIX: '',         URI: 'sqlite:test.db' }],
    // [0, { ENTRY_SUFFIX: '.cjs.js',  URI: 'sqlite:test.db' }],
].forEach(([ep, envs]) => {
    const result_p = require('child_process').run(
        process.execPath,
        [
            require.resolve('./vbox')
        ], {
        env: envs
    })

    assert.equal(result_p, ep)
})