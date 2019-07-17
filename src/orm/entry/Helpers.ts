import url 	  = require('url');

import _cloneDeep 	  = require('lodash.clonedeep');

import DbDriver       = require("@fxjs/db-driver");
import Hook           = require('./Hook');
import Utilities      = require("./Utilities");
import ORMError       = require("./Error");

const SUPPORTED_PROTOCOLS = [
    'sqlite:',
    'mysql:',
    'mssql:',
]

export const buildDbDriver: FxOrmHelper.HelperModules['buildDbDriver'] = function (opts) {
    if (!opts) {
        return Utilities.ORM_Error(new ORMError("CONNECTION_URL_EMPTY", 'PARAM_MISMATCH'));
    } else if (typeof opts === 'string') {
		if ((opts as string).trim().length === 0) {
			return Utilities.ORM_Error(new ORMError("CONNECTION_URL_EMPTY", 'PARAM_MISMATCH'));
		}
	}
    let driver: FxDbDriverNS.Driver = null
    try {
        driver = DbDriver.create(opts)
    } catch (error) {
        if (error.message === '[driver.config] invalid protocol')
    		return Utilities.ORM_Error(new ORMError("CONNECTION_URL_NO_PROTOCOL", 'PARAM_MISMATCH'));
    }
    const config = driver.config

    const isSqlite = config.protocol === 'sqlite:';

	if (isSqlite && config.timezone === undefined)
        driver.extend_config.timezone = 'UTC';
    
	// if (!config.host && !isSqlite) {
	// 	config.host = config.hostname = "localhost";
	// }

    return driver;
}

export const get_many_associations_from_instance_by_extname: FxOrmHelper.HelperModules['get_many_associations_from_instance_by_extname'] = function (instance) {
    return instance.__opts.many_associations
}
export const get_one_associations_from_instance_by_extname: FxOrmHelper.HelperModules['get_one_associations_from_instance_by_extname'] = function (instance) {
    return instance.__opts.one_associations
}
export const get_extendsto_associations_from_instance_by_extname: FxOrmHelper.HelperModules['get_extendsto_associations_from_instance_by_extname'] = function (instance) {
    return instance.__opts.extend_associations
}

/* by instance extname :start */
export const getManyAssociationItemFromInstanceByExtname: FxOrmHelper.HelperModules['getManyAssociationItemFromInstanceByExtname'] = function (instance, extend_name: string) {
    const many_assocs = get_many_associations_from_instance_by_extname(instance)
    
    return many_assocs.find(a => a.name === extend_name)
}

export const getOneAssociationItemFromInstanceByExtname: FxOrmHelper.HelperModules['getOneAssociationItemFromInstanceByExtname'] = function (instance, extend_name: string) {
    const one_assocs = get_one_associations_from_instance_by_extname(instance)
    
    return one_assocs.find(a => a.name === extend_name)
}

export const getExtendsToAssociationItemFromInstanceByExtname: FxOrmHelper.HelperModules['getExtendsToAssociationItemFromInstanceByExtname'] = function (instance, extend_name: string) {
    const extendsto_assocs = get_extendsto_associations_from_instance_by_extname(instance)
    
    return extendsto_assocs.find(a => a.name === extend_name)
}

export const getAssociationItemFromInstanceByExtname: FxOrmHelper.HelperModules['getAssociationItemFromInstanceByExtname'] = function (reltype: string, inst: FxOrmInstance.Instance, extend: string) {
    switch (reltype) {
        default:
            throw 'invalid association reltype!'
        case 'extendsTo':
            return getExtendsToAssociationItemFromInstanceByExtname(inst, extend);
            
        case 'hasOne':
            return getOneAssociationItemFromInstanceByExtname(inst, extend);
            
        case 'hasMany':
            return getManyAssociationItemFromInstanceByExtname(inst, extend);
    }
}
/* by instance extname :end */

/* by instance x assoc_model :start */
export const getManyAssociationItemFromInstanceByAssocModel: FxOrmHelper.HelperModules['getManyAssociationItemFromInstanceByAssocModel'] = function (instance, assoc_model) {
    const many_assocs = get_many_associations_from_instance_by_extname(instance)
    
    return many_assocs.find(a => a.model === assoc_model)
}
export const getOneAssociationItemFromInstanceByAssocModel: FxOrmHelper.HelperModules['getOneAssociationItemFromInstanceByAssocModel'] = function (instance, assoc_model) {
    const one_assocs = get_one_associations_from_instance_by_extname(instance)
    
    return one_assocs.find(a => a.model === assoc_model)
}
export const getExtendsToAssociationItemFromInstanceByAssocModel: FxOrmHelper.HelperModules['getExtendsToAssociationItemFromInstanceByAssocModel'] = function (instance, assoc_model) {
    const extendsto_assocs = get_extendsto_associations_from_instance_by_extname(instance)
    
    return extendsto_assocs.find(a => a.model === assoc_model)
}
export const getAssociationItemFromInstanceByAssocModel: FxOrmHelper.HelperModules['getAssociationItemFromInstanceByAssocModel'] = function (reltype: string, inst: FxOrmInstance.Instance, assoc_model) {
    switch (reltype) {
        default:
            throw 'invalid association reltype!'
        case 'extendsTo':
            return getManyAssociationItemFromInstanceByAssocModel(inst, assoc_model);
            
        case 'hasOne':
            return getOneAssociationItemFromInstanceByAssocModel(inst, assoc_model);
            
        case 'hasMany':
            return getExtendsToAssociationItemFromInstanceByAssocModel(inst, assoc_model);
    }
}
/* by instance x assoc_model :end */

/* by ext_name x _model :start */
export const getManyAssociationItemFromModel: FxOrmHelper.HelperModules['getManyAssociationItemFromModel'] = function (ext_name, _model) {
    const rel_info = _model.associations[ext_name]

    if (!rel_info || rel_info.type !== 'hasMany')
        return null;

    return rel_info.association
}
export const getOneAssociationItemFromModel: FxOrmHelper.HelperModules['getOneAssociationItemFromModel'] = function (ext_name, _model) {
    const rel_info = _model.associations[ext_name]

    if (!rel_info || rel_info.type !== 'hasOne')
        return null;

    return rel_info.association
}
export const getExtendsToAssociationItemFromModel: FxOrmHelper.HelperModules['getExtendsToAssociationItemFromModel'] = function (ext_name, _model) {
    const rel_info = _model.associations[ext_name]

    if (!rel_info || rel_info.type !== 'extendsTo')
        return null;

    return rel_info.association
}
export const getAssociationItemFromModel: FxOrmHelper.HelperModules['getAssociationItemFromModel'] = function (reltype, extend_name, _model) {
    switch (reltype) {
        default:
            throw 'invalid association reltype!'
        case 'extendsTo':
            return getManyAssociationItemFromModel(extend_name, _model);
            
        case 'hasOne':
            return getOneAssociationItemFromModel(extend_name, _model);
            
        case 'hasMany':
            return getExtendsToAssociationItemFromModel(extend_name, _model);
    }
}
export const tryGetAssociationItemFromModel: FxOrmHelper.HelperModules['tryGetAssociationItemFromModel'] = function (extend_name, _model) {
    return getManyAssociationItemFromModel(extend_name, _model) || getOneAssociationItemFromModel(extend_name, _model) || getExtendsToAssociationItemFromModel(extend_name, _model)
}
/* by ext_name x assoc_model :end */

/* hooks :start */
export const prependHook: FxOrmHelper.HelperModules['prependHook'] = function (hooks, hookName, preLogic) {
	if (typeof hooks[hookName] === 'function') {
		var oldHook = hooks[hookName];
		
		const callOldHook = function (next: Function|boolean) {
            if (typeof oldHook === 'function') {
                if (oldHook.length > 0)
                    return oldHook.call(this, next)
                
				oldHook.call(this)
			}
			
			if (typeof next === 'function')
				next()
		}
		
		hooks[hookName] = function (next: Function|boolean) {
			if (preLogic.length > 0) {
				var self = this
				return preLogic.call(this, function () {
					callOldHook.call(self, next)
				})
			}

			preLogic.call(this)
			callOldHook.call(this, next)
		};
	} else {
		hooks[hookName] = preLogic as any;
	}
}

export const preReplaceHook: FxOrmHelper.HelperModules['preReplaceHook'] = function (m, opts, hookName, cb) {
    var _oldHook: FxOrmHook.HookActionCallback | FxOrmHook.HookResultCallback;
    if (opts !== undefined && opts.hooks)
        _oldHook = opts.hooks[hookName] as typeof _oldHook;

    m[hookName](function (this: FxOrmInstance.Instance, next: boolean | FxOrmHook.HookActionNextFunction) {
        cb.call(this, this);

        if (_oldHook) {
            if (_oldHook.length > 0) {
                if (typeof next === 'boolean')
                    return (_oldHook as FxOrmHook.HookResultCallback).call(this, next);
                else
                    return (_oldHook as FxOrmHook.HookActionCallback).call(this, next);
            }
            _oldHook.call(this);
        }

        if (typeof next === 'function')
            next.call(this);
    });
}

export const hookTrigger: FxOrmHelper.HelperModules['hookTrigger'] = Hook.trigger
export const hookWait: FxOrmHelper.HelperModules['hookWait'] = Hook.wait
/* hooks: end */

/* arguments input :start */
export const selectArgs: FxOrmHelper.HelperModules['selectArgs'] = function (args, callback) {
    // copy slice to ensure loop idx is correct
    args = Array.prototype.slice.apply(args);
    
    for (let i = 0, arg: any = null; i < args.length; i++) {
        arg = args[i]
        callback(typeof arg, arg, i);
    }
}
/* arguments input :end */

/* singleton helpers: start */
export function parseDriverUidAndTableNameFromUID (uid: string) {
	uid = uid || ''
	
	const arr = uid.split('/');
	
	return {
		driver_uid: arr[0],
		table: arr[1],
		driver_table_uid: Utilities.makeIdForDriverTable(arr[0], arr[1])
	}
}
/* singleton helpers: end */
export const valueOrComputeFunction = function (
    input,
    args = [],
    thisArg = null
) {
    if (typeof input === 'function')
        input = input.apply(thisArg, args)

    return input
} as FxOrmHelper.HelperModules['valueOrComputeFunction']