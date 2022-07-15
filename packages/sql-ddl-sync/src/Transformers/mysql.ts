import { FxOrmSqlDDLSync__Column } from "../Typo/Column";
import { FxOrmSqlDDLSync } from "../Typo/_common";
import { getSqlQueryDialect } from "../Utils";

type ITransformers = FxOrmSqlDDLSync.Transformers<Class_MySQL>;

const columnSizes = {
	integer: {
		2: 'SMALLINT', 4: 'INTEGER', 8: 'BIGINT'
	},
	floating: {
		4: 'FLOAT',
		8: 'DOUBLE'
	}
};

export const columnInfo2Property: ITransformers['columnInfo2Property'] = function (
	colInfo, ctx
) {
    
    const property = <FxOrmSqlDDLSync__Column.Property>{};
    colInfo = { ...colInfo };
    buffer2ColumnsMeta(colInfo);

    let Type = colInfo.Type + ''
    if (Type.indexOf(" ") > 0) {
        colInfo.SubType = Type.substr(Type.indexOf(" ") + 1).split(/\s+/);
        Type = Type.substr(0, Type.indexOf(" "));
    }

    // match_result
    let [_, _type, _size] = Type.match(/^(.+)\((\d+)\)$/) || [] as any[];
    if (_) {
        colInfo.Size = parseInt(_size, 10);
        Type = _type;
    }

    if (colInfo.Extra.toUpperCase() == "AUTO_INCREMENT") {
        property.serial = true;
        property.unsigned = true;
    }

    if (colInfo.Key == "PRI") {
        property.primary = true;
    }

    if (colInfo.Null.toUpperCase() == "NO") {
        property.required = true;
    }
    if (colInfo.Default !== "null") {
        property.defaultValue = colInfo.Default;
    }

    switch (Type.toUpperCase()) {
        case "SMALLINT":
        case "INTEGER":
        case "BIGINT":
        case "INT":
            property.type = "integer";
            property.size = 4; // INT
            for (let k in columnSizes.integer) {
                if ((columnSizes.integer as any)[k] == Type.toUpperCase()) {
                    property.size = k;
                    break;
                }
            }
            break;
        case "FLOAT":
        case "DOUBLE":
            property.type = "number";
            property.rational = true;
            for (let k in columnSizes.floating) {
                if ((columnSizes.floating as any)[k] == Type.toUpperCase()) {
                    property.size = k;
                    break;
                }
            }
            break;
        case "TINYINT":
            if (colInfo.Size == 1) {
                property.type = "boolean";
            } else {
                property.type = "integer";
            }
            break;
        case "DATETIME":
            property.time = true;
        case "DATE":
            property.type = "date";
            break;
        case "LONGBLOB":
            property.big = true;
        case "BLOB":
            property.type = "binary";
            break;
        case "VARCHAR":
            property.type = "text";
            if (colInfo.Size) {
                property.size = colInfo.Size;
            }
            break;
        case "TEXT":
            property.type = "text";
            break;
        case "POINT":
            property.type = "point";
            break;
        default:
            let [_2, _enum_value_str] = Type.match(/^enum\('(.+)'\)$/) || [] as any;
            if (_2) {
                property.type = "enum";
                property.values = _enum_value_str.split(/'\s*,\s*'/);
                break;
            }
            throw new Error(`Unknown property type '${Type}'`);
    }

    if (property.serial) {
        property.type = "serial";
    }

    return property;
};

export const property2ColumnType: ITransformers['property2ColumnType'] = function (
    inputProperty, ctx
) {
    const property = { ...inputProperty }

    const result: ReturnType<ITransformers['property2ColumnType']> = {
        isCustomType: false,
        property,
        value: '' as FxOrmSqlDDLSync__Column.ColumnType_MySQL,
        before: false
    }


	if (property.type == 'number' && property.rational === false) {
		property.type = 'integer';
		delete property.rational;
	}

	switch (property.type) {
		case "text":
			if (property.big) {
				result.value = "LONGTEXT";
			} else {
				result.value = "VARCHAR(" + Math.min(Math.max(parseInt(property.size as any, 10) || 255, 1), 65535) + ")";
			}
			break;
		case "integer":
			result.value = (columnSizes.integer as any)[property.size] || columnSizes.integer[4];
			break;
		case "number":
			result.value = (columnSizes.floating as any)[property.size] || columnSizes.floating[4];
			break;
		case "serial":
			property.type = "number";
			property.serial = true;
			property.key = true;
			result.value = `INT(${property.size || 11})`;
			break;
		case "boolean":
			result.value = "TINYINT(1)";
			break;
		case "datetime":
			property.type = "date";
			property.time = true;
		case "date":
			if (!property.time) {
				result.value = "DATE";
			} else {
				result.value = "DATETIME";
			}
			break;
		case "binary":
		case "object":
			if (property.big === true) {
				result.value = "LONGBLOB";
			} else {
				result.value = "BLOB";
			}
			break;
		case "enum":
			result.value = "ENUM (" + property.values.map((val: any) => getSqlQueryDialect('mysql').escapeVal(val)) + ")";
			break;
		case "point":
			result.value = "POINT";
			break;
		default:
            result.isCustomType = true;
            break;
	}

	if (!result.value) {
        return result;
    }

	if (property.required) {
		result.value += " NOT NULL";
	}
	if (property.serial) {
		if (!property.required) {
			// append if not set
			result.value += " NOT NULL";
		}
		result.value += " AUTO_INCREMENT";
	}

    return result;
}

export const buffer2ColumnsMeta: ITransformers['buffer2ColumnsMeta'] = function (col) {
	col.Type = col.Type ? col.Type.toString() : '';
	col.Size = col.Size ? col.Size.toString() : '';
	col.Extra = col.Extra ? col.Extra.toString() : '';
	col.Key = col.Key ? col.Key.toString() : '';
	col.Null = col.Null ? col.Null.toString() : '';
	col.Default = col.Default ? col.Default.toString() : '';

    return col as any;
}