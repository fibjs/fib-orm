import { ACLTree } from './acl-tree';

import FibPool = require('fib-pool')
import { Helpers } from '@fxjs/orm'
import * as ORM from '@fxjs/orm'
import { configUACLOrm, getConfigStorageServiceRouting } from './config-acl-tree';
import { decodeGrantTareget, encodeGrantTareget } from './_utils';

function attachMethodsToModel (m_opts: FxOrmModel.ModelDefineOptions) {
    m_opts.methods = m_opts.methods || {};
    if (typeof m_opts.methods.$getUacis !== 'function')
        m_opts.methods.$getUacis = function ({
            prefix = ''
        }: {
            prefix?: string
        } = {}) {
            prefix = prefix || this.$uaclPrefix() || ''

            if (!this.id)
                throw Error(`instance's id is required`)

            return {
                objectless: `${prefix}/${this.model().table}/0`,
                object: `${prefix}/${this.model().table}/${this.id}`,
                id: this.id
            }
        }

    if (typeof m_opts.methods.$uaclPrefix !== 'function')
        m_opts.methods.$uaclPrefix = function (value?: string) {
            const key = '$__uaclPrefix'

            if (value === undefined)
                return this[key] || ''
            
            if (!value)
                throw `[$uaclPrefix] value must be an non-empty string`

            if (!this.hasOwnProperty(key))
                Object.defineProperty(this, key, {
                    value: value,
                    enumerable: false,
                    writable: false,
                    configurable: true
                })
        }
}
/**
 * 
 * @sample 
 *  - instance.$uacl(): get acl via instance -> orm --> aclTree.getNode[INSTANCE/ID]
 *  - model.$uacl(): get acl via model -> orm --> aclTree.getNode[INSTANCE/0]
 *  - model.$uacl(id): get acl via model -> orm --> aclTree.getNode[INSTANCE/ID]
 *  - association.$uacl({pinstance?, instance?}): get acl via association -> aclTree.getNode[P_INSTANCE/PID/INSTANCE/ID]
 */

function UACLTreeGenerator (
    { uid = '', role = '', orm = null, pool = null }: {
        uid: string,
        role: string,
        /* UACL orm, not host/main orm */
        orm: FxOrmPluginUACLOptions['orm'],
        pool?: FibPoolNS.FibPoolFunction<FxORMPluginUACLNS.ACLTree>
    }
): FxORMPluginUACLNS.ACLTree | Function {
    if (!orm)
        throw Error(`[UACLTreeGenerator] orm is required`)
    if (!uid && !role)
        throw Error(`[UACLTreeGenerator] there must be existed at least one in uid or role`)

    const initialData = {
        type: null as FxORMPluginUACLNS.ACLTree['type'],
        get name () {
            return this.type === 'user' ? uid : role
        }
    }
    
    initialData.type = !!uid ? 'user' : null
    if (!initialData.type)
        initialData.type = !!role ? 'role' : null

    const treeName = encodeGrantTareget(initialData.type, initialData.name)

    if (pool) {
        return (cb: any) => pool(treeName, cb)
    }

    if (!orm.hasOwnProperty('_uaclTreeStores'))
        Object.defineProperty(orm, '_uaclTreeStores', {
            value: {},
            configurable: false,
            writable: false,
            enumerable: false
        })

    if (!orm._uaclTreeStores[treeName])
        orm._uaclTreeStores[treeName] = new ACLTree({
            name: initialData.name,
            type: initialData.type,
            configStorageServiceRouting: getConfigStorageServiceRouting({ orm })
        })

    return orm._uaclTreeStores[treeName]
}

function UACLConstructorGenerator (uaclORM: FxOrmNS.ORM, pool?: FibPoolNS.FibPoolFunction<FxORMPluginUACLNS.ACLTree>) {
    return function (cfg: any) {
        cfg = {...cfg}
        cfg.orm = uaclORM
        cfg.pool = pool

        return UACLTreeGenerator(cfg)
    }
}

const Plugin: FxOrmPluginUACL = function (orm, plugin_opts) {
    plugin_opts = plugin_opts || {};

    const { defineUACLInMainORM = true } = plugin_opts;

    const {
        orm: UACLOrm = ORM.connectSync({
            ...orm.driver.config,
            pool: {}
        }) as FxOrmNS.ORM
    } = plugin_opts;

    if (orm === UACLOrm)
        throw Error(`UACLOrm cannot be orm`)

    if (defineUACLInMainORM) {
        configUACLOrm(orm)
    }

    configUACLOrm(UACLOrm)

    const uacl_models_config = new Map<FxOrmModel.Model['name'], {
        userModel: FxOrmModel.Model,
        roleModel: FxOrmModel.Model
    }>()

    const defaultUserModel = () => orm.models.user
    const defaultRoleModel = () => orm.models.role

    const uaclPool = FibPool<FxORMPluginUACLNS.ACLTree>({
        create: (treeName) => {
            const { id, type } = decodeGrantTareget(treeName)
            
            return new ACLTree({
                name: id,
                type: type,
                configStorageServiceRouting: getConfigStorageServiceRouting({ orm: UACLOrm })
            })
        },
        destroy: (tree) => {
            tree.reset()
        },
        timeout: 30 * 1000,
        maxsize: 1000
    });

    const [ $uacl, $uaclPool ] = [
        UACLConstructorGenerator(UACLOrm),
        UACLConstructorGenerator(UACLOrm, uaclPool)
    ]

    return {
        beforeDefine (name, props, m_opts) {
            attachMethodsToModel(m_opts)

            if (!m_opts.uacl)
                return ;

            const uaclCfg = m_opts.uacl = { ...m_opts.uacl };

            uacl_models_config.set(name, {
                userModel: Helpers.valueOrComputeFunction(uaclCfg.userModel || defaultUserModel),
                roleModel: Helpers.valueOrComputeFunction(uaclCfg.roleModel || defaultRoleModel),
            });
        },
        define (model) {
            if ([UACLOrm.models.uacl].includes(model))
                return ;

            if (!uacl_models_config.has(model.name))
                return ;

            model.afterLoad(function () {
                if (!this.$uacl)
                    Object.defineProperty(this, '$uacl', {
                        value: $uacl,
                        writable: false,
                        configurable: false,
                        enumerable: false
                    })
                if (!this.$uaclPool)
                    Object.defineProperty(this, '$uaclPool', {
                        value: $uaclPool,
                        writable: false,
                        configurable: false,
                        enumerable: false
                    })
            }, { oldhook: 'prepend' })
        }
    }
};

export = Plugin