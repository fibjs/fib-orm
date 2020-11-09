import { FxOrmModel } from './Typo/model';
import { FxOrmNS } from './Typo/ORM';
import { FxOrmProperty } from './Typo/property';
export declare function normalize(opts: {
    prop: FxOrmModel.ComplexModelPropertyDefinition;
    name: string;
    customTypes: FxOrmNS.ORM['customTypes'];
    settings: FxOrmNS.ORM['settings'];
}): FxOrmProperty.NormalizedProperty;
