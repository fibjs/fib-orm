import { IPropTransformer, IProperty, PropertyType, __StringType } from "../Property"
import { COLUMN_NUMER_TYPE_IDX, filterPropertyDefaultValue } from "../Utils"

export type ColumnType_DM = PropertyType

export interface ColumnInfoDM {
    COLUMN_NAME?: string
    DATA_TYPE?: string
    DATA_LENGTH?: number | string
    DATA_PRECISION?: number | string
    DATA_SCALE?: number | string
    NULLABLE?: __StringType<'Y' | 'N' | 'YES' | 'NO'>
    DATA_DEFAULT?: any
    CHAR_LENGTH?: number | string
    IDENTITY_COLUMN?: __StringType<'YES' | 'NO' | 'Y' | 'N'>
    IS_IDENTITY?: __StringType<'YES' | 'NO' | 'Y' | 'N'>
    COMMENT?: string

    column_name?: string
    data_type?: string
    data_length?: number | string
    data_precision?: number | string
    data_scale?: number | string
    nullable?: __StringType<'Y' | 'N' | 'YES' | 'NO'>
    data_default?: any
    char_length?: number | string
    identity_column?: __StringType<'YES' | 'NO' | 'Y' | 'N'>
    is_identity?: __StringType<'YES' | 'NO' | 'Y' | 'N'>
    comment?: string
}

type DB_INTEGER = number;

type DB_TEXT = string;

type DB_VARCHAR<T extends number = 255> = string;

const columnSizes = {
    integer: {
        [COLUMN_NUMER_TYPE_IDX.SHORT]: 'SMALLINT',
        [COLUMN_NUMER_TYPE_IDX.INTEGER]: 'INTEGER',
        [COLUMN_NUMER_TYPE_IDX.LONG]: 'BIGINT'
    },
    floating: {
        [COLUMN_NUMER_TYPE_IDX.FLOAT]: 'FLOAT',
        [COLUMN_NUMER_TYPE_IDX.DOUBLE]: 'DOUBLE'
    }
};

function normalizeColInfo(colInfo: ColumnInfoDM) {
    const normalized = { ...colInfo } as ColumnInfoDM;
    normalized.COLUMN_NAME = (normalized.COLUMN_NAME ?? normalized.column_name) as any;
    normalized.DATA_TYPE = (normalized.DATA_TYPE ?? normalized.data_type) as any;
    normalized.DATA_LENGTH = (normalized.DATA_LENGTH ?? normalized.data_length) as any;
    normalized.DATA_PRECISION = (normalized.DATA_PRECISION ?? normalized.data_precision) as any;
    normalized.DATA_SCALE = (normalized.DATA_SCALE ?? normalized.data_scale) as any;
    normalized.NULLABLE = (normalized.NULLABLE ?? normalized.nullable) as any;
    normalized.DATA_DEFAULT = (normalized.DATA_DEFAULT ?? normalized.data_default) as any;
    normalized.CHAR_LENGTH = (normalized.CHAR_LENGTH ?? normalized.char_length) as any;
    normalized.IDENTITY_COLUMN = (normalized.IDENTITY_COLUMN ?? normalized.identity_column ?? normalized.IS_IDENTITY ?? normalized.is_identity) as any;
    normalized.COMMENT = (normalized.COMMENT ?? normalized.comment ?? (normalized as any).COMMENTS ?? (normalized as any).comments) as any;

    normalized.COLUMN_NAME = normalized.COLUMN_NAME ? normalized.COLUMN_NAME.toString() : '';
    normalized.DATA_TYPE = normalized.DATA_TYPE ? normalized.DATA_TYPE.toString() : '';
    normalized.DATA_LENGTH = normalized.DATA_LENGTH ? normalized.DATA_LENGTH.toString() : '';
    normalized.DATA_PRECISION = normalized.DATA_PRECISION ? normalized.DATA_PRECISION.toString() : '';
    normalized.DATA_SCALE = normalized.DATA_SCALE ? normalized.DATA_SCALE.toString() : '';
    normalized.NULLABLE = normalized.NULLABLE ? normalized.NULLABLE.toString() as any : '';
    normalized.DATA_DEFAULT = normalized.DATA_DEFAULT !== undefined ? normalized.DATA_DEFAULT.toString() : normalized.DATA_DEFAULT;
    normalized.CHAR_LENGTH = normalized.CHAR_LENGTH ? normalized.CHAR_LENGTH.toString() : '';
    normalized.IDENTITY_COLUMN = normalized.IDENTITY_COLUMN ? normalized.IDENTITY_COLUMN.toString() as any : '';
    normalized.COMMENT = normalized.COMMENT ? normalized.COMMENT.toString() : '';

    return normalized;
}

function isIdentityColumn(colInfo: ColumnInfoDM) {
    const v = colInfo.IDENTITY_COLUMN ? colInfo.IDENTITY_COLUMN.toString().toUpperCase() : '';
    return v === 'YES' || v === 'Y' || v === 'TRUE' || v === '1';
}

function colInfoToProperty(colInfo: ColumnInfoDM) {
    const property = <IProperty>{};
    const col = normalizeColInfo(colInfo);

    const type = col.DATA_TYPE.toUpperCase();

    if (isIdentityColumn(col)) {
        property.serial = true;
        property.key = true;
        property.primary = true;
    }

    if (col.NULLABLE && (col.NULLABLE.toUpperCase() === 'N' || col.NULLABLE.toUpperCase() === 'NO')) {
        property.required = true;
    }
    if (col.DATA_DEFAULT !== 'null' && col.DATA_DEFAULT !== undefined && col.DATA_DEFAULT !== null) {
        property.defaultValue = col.DATA_DEFAULT;
    }

    switch (type) {
        case 'SMALLINT':
        case 'INTEGER':
        case 'INT':
        case 'BIGINT':
        case 'TINYINT':
            property.type = 'integer';
            property.size = COLUMN_NUMER_TYPE_IDX.INTEGER;
            for (let k in columnSizes.integer) {
                if ((columnSizes.integer as any)[k] === type) {
                    property.size = parseInt(k, 10);
                    break;
                }
            }
            break;
        case 'FLOAT':
        case 'DOUBLE':
        case 'REAL':
        case 'NUMERIC':
        case 'DECIMAL':
            property.type = 'number';
            property.rational = true;
            property.size = COLUMN_NUMER_TYPE_IDX.DOUBLE;
            if (type === 'FLOAT' || type === 'REAL') {
                property.size = COLUMN_NUMER_TYPE_IDX.FLOAT;
            }
            break;
        case 'BIT':
            property.type = 'boolean';
            break;
        case 'DATE':
            property.type = 'date';
            break;
        case 'DATETIME':
        case 'TIMESTAMP':
            property.type = 'date';
            property.time = true;
            break;
        case 'CHAR':
        case 'VARCHAR':
        case 'VARCHAR2':
        case 'NCHAR':
        case 'NVARCHAR':
            property.type = 'text';
            if (col.CHAR_LENGTH) {
                property.size = parseInt(String(col.CHAR_LENGTH), 10);
            } else if (col.DATA_LENGTH) {
                property.size = parseInt(String(col.DATA_LENGTH), 10);
            }
            break;
        case 'TEXT':
        case 'CLOB':
        case 'LONG':
        case 'LONGVARCHAR':
            property.type = 'text';
            property.big = true;
            break;
        case 'BLOB':
        case 'IMAGE':
        case 'LONGVARBINARY':
        case 'VARBINARY':
        case 'BINARY':
        case 'RAW':
            property.type = 'binary';
            break;
        default:
            throw new Error(`Unknown property type '${type}'`);
    }

    if (property.serial) {
        property.type = 'serial';
    }

    property.mapsTo = col.COLUMN_NAME;

    if (col.COMMENT) {
        property.comment = col.COMMENT;
    }

    return property;
}

export const rawToProperty: IPropTransformer<ColumnInfoDM>['rawToProperty'] = function (
    colInfo, ctx
) {
    return {
        raw: colInfo,
        property: colInfoToProperty(colInfo)
    }
};

export const toStorageType: IPropTransformer<ColumnInfoDM>['toStorageType'] = function (
    inputProperty, ctx
) {
    const property = { ...inputProperty }

    const result: ReturnType<IPropTransformer<ColumnInfoDM>['toStorageType']> = {
        isCustom: false,
        property,
        typeValue: '',
    }

    if (property.type == 'number' && property.rational === false) {
        property.type = 'integer';
        delete property.rational;
    }

    switch (property.type) {
        case 'text':
            if (property.big) {
                result.typeValue = 'TEXT';
            } else {
                const size = Math.min(Math.max(parseInt(property.size as any, 10) || 255, 1), 32767);
                result.typeValue = `VARCHAR(${size})`;
            }
            break;
        case 'integer':
            result.typeValue = (columnSizes.integer as any)[property.size] || columnSizes.integer[COLUMN_NUMER_TYPE_IDX.INTEGER];
            break;
        case 'number':
            result.typeValue = (columnSizes.floating as any)[property.size] || columnSizes.floating[COLUMN_NUMER_TYPE_IDX.DOUBLE];
            break;
        case 'serial':
            property.type = 'number';
            property.serial = true;
            property.key = true;
            result.typeValue = 'INT';
            break;
        case 'boolean':
            result.typeValue = 'BIT';
            break;
        case 'datetime':
            property.type = 'date';
            property.time = true;
        case 'date':
            result.typeValue = property.time ? 'DATETIME' : 'DATE';
            break;
        case 'binary':
            result.typeValue = 'BLOB';
            break;
        case 'object':
            result.typeValue = 'TEXT';
            break;
        case 'point':
            result.typeValue = 'TEXT';
            break;
        case 'enum':
            result.typeValue = 'VARCHAR(255)';
            break;
        case 'point':
        default:
            result.isCustom = true;
            break;
    }

    if (!result.typeValue && !result.isCustom) return result;

    if (property.required) {
        result.typeValue += ' NOT NULL';
    }
    if (property.serial) {
        if (!property.required) {
            result.typeValue += ' NOT NULL';
        }
        result.typeValue += ' IDENTITY(1,1)';
    }

    if (result.isCustom) {
        if (ctx.customTypes?.[property.type]) {
            result.typeValue = ctx.customTypes[property.type].datastoreType(property, ctx)
        }
    } else if (property.hasOwnProperty('defaultValue') && property.defaultValue !== undefined) {
        const defaultValue = property.type === 'date' && property.defaultValue === Date.now
            ? 'CURRENT_TIMESTAMP'
            : filterPropertyDefaultValue(property, ctx);

        result.typeValue += ` DEFAULT ${
            property.type === 'date' && (['CURRENT_TIMESTAMP'].includes(defaultValue))
            ? defaultValue
            : ctx.escapeVal(defaultValue)}`;
    }

    if (property.comment) {
        result.typeValue += ` COMMENT ${ctx.escapeVal(property.comment)}`;
    }

    return result;
}

export const filterRawColumns: IPropTransformer<ColumnInfoDM>['filterRawColumns'] = function (col) {
    return normalizeColInfo(col);
}
