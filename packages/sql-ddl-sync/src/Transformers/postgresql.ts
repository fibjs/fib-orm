import { FxOrmSqlDDLSync__Column } from "../Typo/Column";
import { FxOrmSqlDDLSync } from "../Typo/_common";
import { psqlGetEnumTypeName } from "../Utils";

type ITransformers = FxOrmSqlDDLSync.Transformers<Class_DbConnection>;

const columnSizes = {
    integer: { 2: 'SMALLINT', 4: 'INTEGER', 8: 'BIGINT' },
    floating: { 4: 'REAL', 8: 'DOUBLE PRECISION' },
};

export const columnInfo2Property: ITransformers['columnInfo2Property'] = function (
	dCol, ctx
) {
    let property = <FxOrmSqlDDLSync__Column.Property>{};

    if (dCol.is_nullable.toUpperCase() == "NO") {
        property.required = true;
    }
    if (dCol.column_default !== null) {
        let m = dCol.column_default.match(/^'(.+)'::/);
        if (m) {
            property.defaultValue = m[1];
        } else {
            property.defaultValue = dCol.column_default;
        }
    }

    switch (dCol.data_type.toUpperCase()) {
        case "SMALLINT":
        case "INTEGER":
        case "BIGINT":
            if (typeof dCol.column_default == 'string' && dCol.column_default.indexOf('nextval(') == 0) {
                property.type = "serial";
            } else {
                property.type = "integer";
            }
            for (let k in columnSizes.integer) {
                if ((columnSizes.integer as any)[k] == dCol.data_type.toUpperCase()) {
                    property.size = k;
                    break;
                }
            }
            break;
        case "REAL":
        case "DOUBLE PRECISION":
            property.type = "number";
            property.rational = true;
            for (var k in columnSizes.floating) {
                if ((columnSizes.floating as any)[k] == dCol.data_type.toUpperCase()) {
                    property.size = k;
                    break;
                }
            }
            break;
        case "BOOLEAN":
            property.type = "boolean";
            break;
        case "TIMESTAMP WITH TIME ZONE":
            property.time = true;
            property.type = "date";
            break;
        case "TIMESTAMP WITHOUT TIME ZONE":
            property.time = false;
            property.type = "date";
            break;
        case "DATE":
            property.type = "date";
            break;
        case "BYTEA":
            property.type = "binary";
            break;
        case "TEXT":
            property.type = "text";
            break;
        case "CHARACTER VARYING":
            property.type = "text";
            if (dCol.character_maximum_length) {
                property.size = dCol.character_maximum_length;
            }
            break;
        case "USER-DEFINED":
            if (dCol.udt_name.match(/_enum_/)) {
                property.type = "enum";
                property.values = [];
                break;
            }
        default:
            throw new Error("Unknown column type '" + dCol.data_type + "'");
    }

    return property;
}

export const property2ColumnType: ITransformers['property2ColumnType'] = function (
    inputProperty, ctx
) {
    const property = { ...inputProperty }

    const result: ReturnType<ITransformers['property2ColumnType']> = {
        isCustomType: false,
        property,
        value: '' as FxOrmSqlDDLSync__Column.ColumnType_PostgreSQL,
        before: false
    }

	if (property.type == 'number' && property.rational === false) {
		property.type = 'integer';
		delete property.rational;
	}

	if (property.serial) {
		result.value = "SERIAL";
	} else {
		switch (property.type) {
			case "text":
				result.value = "TEXT";
				break;
			case "integer":
				result.value = (columnSizes.integer as any)[property.size || 4];
				break;
			case "number":
				result.value = (columnSizes.floating as any)[property.size || 4];
				break;
			case "serial":
				property.serial = true;
				property.key = true;
				result.value = "SERIAL";
				break;
			case "boolean":
				result.value = "BOOLEAN";
				break;
			case "datetime":
				property.type = "date";
				property.time = true;
			case "date":
				if (!property.time) {
					result.value = "DATE";
				} else {
					result.value = "TIMESTAMP WITHOUT TIME ZONE";
				}
				break;
			case "binary":
			case "object":
				result.value = "BYTEA";
				break;
			case "enum":
                const collection = (ctx?.collection || '');
                result.value = psqlGetEnumTypeName(collection, property.mapsTo?.toLowerCase() || '');
				break;
			case "point":
				result.value = "POINT";
				break;
			default:
                result.isCustomType = true;
                break;
		}

		if (!result.value) return result;

		if (property.required) {
			result.value += " NOT NULL";
		}
	}

    return result;
}