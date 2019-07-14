const test = require('test')
test.setup()

var Core   = require("../..");

describe("Utils", function () {
  describe("exposeErrAndResultFromSyncMethod", function () {
    it("existence", () => {
      assert.isFunction(Core.Utils.exposeErrAndResultFromSyncMethod)
    });

    ;[
      undefined,
      null,
      Symbol('#check'),
      {},
      [],
      0,
      '0',
      true,
      false,
      () => void 0
    ].forEach(_result => {
      it(`check result: ${String(_result)}`, () => {
        const { error, result } = Core.Utils.exposeErrAndResultFromSyncMethod(
          () => _result
        );

        assert.isUndefined(error)
        assert.equal(result, _result)
      });
    });

    ;[
      'message',
      new Error('message')
    ].forEach((_error, idx) => {
      it(`error message in synchronous flow [${idx + 1}]`, () => {
          const { error, result } = Core.Utils.exposeErrAndResultFromSyncMethod(
            () => {
              throw _error
            }
          );

          assert.isUndefined(result)
          assert.exist(error)
          assert.deepEqual(error, _error)
      })
    });
  });

  describe("throwErrOrCallabckErrResult", function () {
    it("existence", () => {
      assert.isFunction(Core.Utils.throwErrOrCallabckErrResult)
    });

    ;[
      [
        '',
        { no_throw: true, callback: undefined, use_tick: false },
        new Error('message'),
        (opts, exposedErrResult) => {
          assert.equal(exposedErrResult.error.message, 'message')
          Core.Utils.throwErrOrCallabckErrResult(exposedErrResult, opts)
        }
      ],
      [
        '',
        { no_throw: false, callback: undefined, use_tick: false },
        new Error('message'),
        (opts, exposedErrResult) => {
          assert.equal(exposedErrResult.error.message, 'message')
          assert.throws(() => {
            Core.Utils.throwErrOrCallabckErrResult(exposedErrResult, opts)
          })
        }
      ],
      [
        'if no_throw == true, callback would be used',
        { no_throw: true, callback: (err, result) => {
          assert.exist(err)
          assert.isUndefined(result)
          assert.equal(err.message, 'message')
        }, use_tick: false },
        new Error('message'),
        (opts, exposedErrResult) => {
          Core.Utils.throwErrOrCallabckErrResult(exposedErrResult, opts)
        }
      ],
      [
        'if no_throw == false, callback would not be used',
        { no_throw: false, callback: (err, result) => {
          assert.exist(err)
          assert.isUndefined(result)
          assert.equal(err.message, 'message')
        }, use_tick: false },
        new Error('message'),
        (opts, exposedErrResult) => {
          assert.throws(() => {
            Core.Utils.throwErrOrCallabckErrResult(exposedErrResult, opts)
          })
        }
      ]
    ].forEach(([ desc, opts, err_info, checkor]) => {
      it(`opts: ${JSON.stringify(opts)} ${desc ? `-- ${desc}` : ``}`, () => {
          const exposedErrResult = Core.Utils.exposeErrAndResultFromSyncMethod(
            () => {
              throw err_info
            }
          );

          checkor(opts, exposedErrResult);
      })
    })
  });
});

if (require.main === module) {
  test.run(console.DEBUG)
}