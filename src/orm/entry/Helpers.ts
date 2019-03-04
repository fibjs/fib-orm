export const get_many_associations_from_instance_by_extname: FxOrmHelper.HelperModules['get_many_associations_from_instance_by_extname'] = function (instance) {
    return instance.__opts.many_associations
}
export const get_one_associations_from_instance_by_extname: FxOrmHelper.HelperModules['get_one_associations_from_instance_by_extname'] = function (instance) {
    return instance.__opts.one_associations
}
export const get_extendsto_associations_from_instance_by_extname: FxOrmHelper.HelperModules['get_extendsto_associations_from_instance_by_extname'] = function (instance) {
    return instance.__opts.extend_associations
}

/* by extname :start */
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
/* by extname :end */

/* by assoc_model :start */
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
/* by assoc_model :end */