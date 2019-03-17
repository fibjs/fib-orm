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
/* by ext_name x assoc_model :end */