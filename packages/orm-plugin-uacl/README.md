
## orm-plugin-uacl

### ACL - Grant

```javascript
const [ p, stage, task, member ] = chain

const chainName = unifyChain(chain)
/**
 * Grant.createSync({
 *      // unified access control id
 *      uaci: `uaci://project/1/stages/0/tasks/8/members/7`,
 *      action: 'read', // basic CRUD | wildcard | custom
 *      value: true, // field
 * })
 */
orm.$grant.set(chainName/* chain */, 'read', true)
orm.$grant.set(chainName/* chain */, 'write', false) // would never store, because defualtValue is just false
orm.$grant.set(chainName/* chain */, 'delete', false) // would never store, because defualtValue is just false
orm.$grant.set(chainName/* chain */, 'find', true)
orm.$grant.set(chainName/* chain */, '*', true)
orm.$grant.set(chainName/* chain */, 'custom', true)

orm.$grant.get(chainName/* chain */, 'read')
orm.$grant.get(chainName/* chain */, 'write')
orm.$grant.get(chainName/* chain */, 'delete')
orm.$grant.get(chainName/* chain */, 'find')
orm.$grant.get(chainName/* chain */, '*')
orm.$grant.get(chainName/* chain */, 'custom')

// delete all grant of this uaci
orm.$grant.delete(chainName)
orm.$grant.delete(chainName/* chain */, 'find')
```

```javascript
define('project', {}, {
    ievents: {
        'after:addStages' (this) {
            process.nextTick(() => {
                ORM.pool
            })
            coroutine.parallel(this.stages, (stage => {
                // this.$grant.set([ this, stage ], 'read', true)
                orm.$grant([this, stage, stage.getOwnerSync()], read, true);
            });
        }
    }
})

```

## TODOs

### Features

- [ ] Node Expire: `{TIMEOUT: number, DEFAULT: 100}`
    - (unit) millisecond
    - [ ] set expire when node generated, default as 0(means never expire)
    - [ ] (db:storage)storage as timestamp
    - [ ] (json) GMT string
    - [ ] auto-update from remote synchronously when it's expired
        - [ ] Auto self-revoking synchronously when it's idle(expired after TIMEOUT)
- [ ]
### Other
- [ ] create 1st version README.md
- [ ] add doc
    - [ ] paragraph about `tree.$grant`
    - [ ] paragraph about `tree.$revoke`
    - [ ] paragraph about `tree.$persist`
    - [ ] paragraph about `tree.$load`
    - [ ] paragraph about `tree.find`
    - [ ] paragraph about `tree.addChildNode`
    - [ ] paragraph about `tree.removeChildNode`
- [ ] test cases
    - [ ] :if grant
- [ ] sample app
    - [ ] simple grant with orm