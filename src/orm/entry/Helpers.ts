export const get_many_associations: FxOrmHelper.HelperModules['get_many_associations'] = function (instance) {
    return instance.__opts.many_associations
}
export const get_many_association_item: FxOrmHelper.HelperModules['get_many_association_item'] = function (instance, extend_name: string) {
    const many_assocs = get_many_associations(instance)
    
    return many_assocs.find(a => a.name === extend_name)
}

export const get_one_associations: FxOrmHelper.HelperModules['get_one_associations'] = function (instance) {
    return instance.__opts.one_associations
}
export const get_one_association_item: FxOrmHelper.HelperModules['get_one_association_item'] = function (instance, extend_name: string) {
    const one_assocs = get_one_associations(instance)
    
    return one_assocs.find(a => a.name === extend_name)
}

export const get_extendsto_associations: FxOrmHelper.HelperModules['get_extendsto_associations'] = function (instance) {
    return instance.__opts.extend_associations
}
export const get_extendsto_association_item: FxOrmHelper.HelperModules['get_extendsto_association_item'] = function (instance, extend_name: string) {
    const extendsto_assocs = get_extendsto_associations(instance)
    
    return extendsto_assocs.find(a => a.name === extend_name)
}

export const get_association_item_by_reltype: FxOrmHelper.HelperModules['get_association_item_by_reltype'] = function (reltype: string, inst: FxOrmInstance.Instance, extend: string) {
    switch (reltype) {
        default:
            throw 'invalid association reltype!'
        case 'extendsTo':
            return get_extendsto_association_item(inst, extend);
            
        case 'hasOne':
            return get_one_association_item(inst, extend);
            
        case 'hasMany':
            return get_many_association_item(inst, extend);
    }
}