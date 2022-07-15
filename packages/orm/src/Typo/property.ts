import type {
    FxOrmSqlDDLSync__Column,
    FxOrmSqlDDLSync__Driver
} from "@fxjs/sql-ddl-sync";

import type {
    FxSqlQuery,
} from '@fxjs/sql-query';

export namespace FxOrmProperty {
    /**
     * @description key linked association type
     *  - 'primary': means this property is for column defined as 'primary'
     *  - 'hasOne': means this property is for column used as asscociated key in 'hasOne' assciation
     */
    export type KlassType = 'primary' | 'hasOne'

    export interface CustomPropertyType extends FxOrmSqlDDLSync__Driver.CustomPropertyType {
        datastoreType: {
            (prop?: FxOrmProperty.NormalizedProperty): string
        }
        valueToProperty?: {
            (value?: any, prop?: FxOrmProperty.NormalizedProperty): any
        }
        propertyToValue?: {
            (value?: any, prop?: FxOrmProperty.NormalizedProperty): any
        }
        datastoreGet?: {
            (prop?: FxOrmProperty.NormalizedProperty, helper?: FxSqlQuery.Class_Query): any
        }
    }
    
    /**
     * @description useful when pass property's option(such as type, big, ...etc) internally, useless for exposed api.
     */
    // interface NormalizedProperty extends FxOrmModel.ModelPropertyDefinition {
    export interface NormalizedProperty extends FxOrmSqlDDLSync__Column.Property {
        // all fields inherited from `FxOrmModel.ModelPropertyDefinition` are still optional

        key?: boolean
        klass?: KlassType
        lazyload?: boolean
        alwaysValidate?: boolean
        lazyname?: string
    }

    /**
     * @deprecated use Record<string, NormalizedProperty> instead
     */
    export interface NormalizedPropertyHash {
        [key: string]: NormalizedProperty
    }

    export interface FieldToPropertyMapType {
        [f_name: string]: NormalizedProperty
    }
}