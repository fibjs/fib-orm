declare namespace FxOrmProperty {
    interface CustomPropertyType extends FxOrmSqlDDLSync__Driver.CustomPropertyType {
        datastoreType: {
            (prop?: FxOrmProperty.NormalizedProperty): string
        }
        valueToProperty?: {
            (value?: any, prop?: FxOrmProperty.NormalizedProperty)
        }
        propertyToValue?: {
            (value?: any, prop?: FxOrmProperty.NormalizedProperty)
        }
        datastoreGet?: {
            (prop?: FxOrmProperty.NormalizedProperty, helper?: FxSqlQuery.Class_Query): any
        }
    }
    
    /**
     * @description useful when pass property's option(such as type, big, ...etc) internally, useless for exposed api.
     */
    // interface NormalizedProperty extends FxOrmModel.ModelPropertyDefinition {
    interface NormalizedProperty extends FxOrmSqlDDLSync__Column.Property {
        // all fields inherited from `FxOrmModel.ModelPropertyDefinition` are still optional

        key?: boolean
        klass?: 'primary' | 'hasOne'
        lazyload?: boolean
        alwaysValidate?: boolean
        lazyname?: string
    }

    interface NormalizedPropertyHash {
        [key: string]: NormalizedProperty
    }

    interface FieldToPropertyMapType {
        [f_name: string]: NormalizedProperty
    }
}