declare namespace FxOrmHelper {
   interface HelperModules {
      get_many_associations_from_instance_by_extname (instance: FxOrmNS.Instance): FxOrmAssociation.InstanceAssociationItem_HasMany[]
      get_one_associations_from_instance_by_extname (instance: FxOrmNS.Instance): FxOrmAssociation.InstanceAssociationItem_HasOne[]
      get_extendsto_associations_from_instance_by_extname (instance: FxOrmNS.Instance): FxOrmAssociation.InstanceAssociationItem_ExtendTos[]

      getManyAssociationItemFromInstanceByExtname (instance: FxOrmNS.Instance, extend_name: string): FxOrmAssociation.InstanceAssociationItem_HasMany
      getOneAssociationItemFromInstanceByExtname (instance: FxOrmNS.Instance, extend_name: string): FxOrmAssociation.InstanceAssociationItem_HasOne
      getExtendsToAssociationItemFromInstanceByExtname (instance: FxOrmNS.Instance, extend_name: string): FxOrmAssociation.InstanceAssociationItem_ExtendTos
      getAssociationItemFromInstanceByExtname (reltype: string, inst: FxOrmInstance.Instance, extend_name: string): FxOrmAssociation.InstanceAssociationItem

      getManyAssociationItemFromInstanceByAssocModel (instance: FxOrmNS.Instance, assoc_model: FxOrmModel.Model): FxOrmAssociation.InstanceAssociationItem_HasMany
      getOneAssociationItemFromInstanceByAssocModel (instance: FxOrmNS.Instance, assoc_model: FxOrmModel.Model): FxOrmAssociation.InstanceAssociationItem_HasOne
      getExtendsToAssociationItemFromInstanceByAssocModel (instance: FxOrmNS.Instance, assoc_model: FxOrmModel.Model): FxOrmAssociation.InstanceAssociationItem_ExtendTos
      getAssociationItemFromInstanceByAssocModel (reltype: string, inst: FxOrmInstance.Instance, assoc_model: FxOrmModel.Model): FxOrmAssociation.InstanceAssociationItem

      getManyAssociationItemFromModel (extend_name: string, _model: FxOrmModel.Model): FxOrmAssociation.InstanceAssociationItem_HasMany
      getOneAssociationItemFromModel (extend_name: string, _model: FxOrmModel.Model): FxOrmAssociation.InstanceAssociationItem_HasOne
      getExtendsToAssociationItemFromModel (extend_name: string, _model: FxOrmModel.Model): FxOrmAssociation.InstanceAssociationItem_ExtendTos
      getAssociationItemFromModel (reltype: string, extend_name: string, _model: FxOrmModel.Model): FxOrmAssociation.InstanceAssociationItem
   }
}