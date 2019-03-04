declare namespace FxOrmHelper {
   interface HelperModules {
       get_many_associations (instance: FxOrmNS.Instance): FxOrmAssociation.InstanceAssociationItem_HasMany[]
        get_many_association_item (instance: FxOrmNS.Instance, extend_name: string): FxOrmAssociation.InstanceAssociationItem_HasMany
        get_one_associations (instance: FxOrmNS.Instance): FxOrmAssociation.InstanceAssociationItem_HasOne[]
        get_one_association_item (instance: FxOrmNS.Instance, extend_name: string): FxOrmAssociation.InstanceAssociationItem_HasOne
        get_extendsto_associations (instance: FxOrmNS.Instance): FxOrmAssociation.InstanceAssociationItem_ExtendTos[]
        get_extendsto_association_item (instance: FxOrmNS.Instance, extend_name: string): FxOrmAssociation.InstanceAssociationItem_ExtendTos
        get_association_item_by_reltype (reltype: string, inst: FxOrmInstance.Instance, extend: string): FxOrmAssociation.InstanceAssociationItem
   }
}