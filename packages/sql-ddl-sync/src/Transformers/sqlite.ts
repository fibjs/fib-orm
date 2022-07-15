import { FxOrmSqlDDLSync__Column } from "../Typo/Column";
import { FxOrmSqlDDLSync } from "../Typo/_common";

type ITransformers = FxOrmSqlDDLSync.Transformers<Class_SQLite>;

export const columnInfo2Property: ITransformers['columnInfo2Property'] = function (
    dCol, ctx
) {
    const prop = <FxOrmSqlDDLSync__Column.PropertySQLite>{};

    if (dCol.pk) {
        prop.key = true;
    }

    if (dCol.notnull) {
        prop.required = true;
    }
    if (dCol.dflt_value) {
        const m = dCol.dflt_value.match(/^'(.*)'$/);
        if (m) {
            prop.defaultValue = m[1];
        } else {
            prop.defaultValue = null;
        }
    }

    const TYPE_UPPER = dCol.type.toUpperCase()

    switch (TYPE_UPPER) {
        case "INTEGER":
            // In sqlite land, integer primary keys are autoincrement by default
            // weather you asked for this behaviour or not.
            // http://www.sqlite.org/faq.html#q1
            if (dCol.pk == 1) {
                prop.type = "serial";
            } else {
                prop.type = "integer";
            }
            break;
        case "INTEGER UNSIGNED":
            prop.type = "boolean";
            break;
        case "REAL":
            prop.type = "number";
            prop.rational = true;
            break;
        case "DATETIME":
            prop.type = "date";
            prop.time = true;
            break;
        case "BLOB":
            prop.type = "binary";
            prop.big = true;
            break;
        case "TEXT":
            prop.type = "text";
            break;
        case "POINT":
            prop.type = "point";
            break;
        default:
            let [_, type, _before, field] = dCol.type.toUpperCase().match(/(.*)\s(AFTER|BEFORE)\s`(.*)`$/) || [] as any[]

            if (_) {
                switch (_before && field) {
                    case 'BEFORE':
                        prop.before = field
                    case 'AFTER':
                        prop.after = field
                        break
                }
                prop.type = type;
                break;
            }

            throw new Error(`Unknown prop type '${dCol.type}'`);
    }

    return prop;
}

export const property2ColumnType: ITransformers['property2ColumnType'] = function (
    inputProperty, ctx
) {
    const property = { ...inputProperty }

    const result: ReturnType<ITransformers['property2ColumnType']> = {
        isCustomType: false,
        property,
        value: '' as FxOrmSqlDDLSync__Column.ColumnType_SQLite,
        before: false
    }

	if (property.type == 'number' && property.rational === false) {
		property.type = 'integer';
		delete property.rational;
	}

	switch (property.type) {
		case "text":
			result.value = "TEXT";
			break;
		case "integer":
			result.value = "INTEGER";
			break;
		case "number":
			result.value = "REAL";
			break;
		case "serial":
			property.serial = true;
			property.key = true;
			result.value = "INTEGER";
			break;
		case "boolean":
			result.value = "INTEGER UNSIGNED";
			break;
		case "datetime":
			property.type = "date";
			property.time = true;
		case "date":
			result.value = "DATETIME";
			break;
		case "binary":
		case "object":
			result.value = "BLOB";
			break;
		case "enum":
			result.value = "INTEGER";
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
	if (property.key) {
		if (!property.required) {
			// append if not set
			result.value += " NOT NULL";
		}
		if (property.serial) {
			result.value += " PRIMARY KEY";
		}
	}
	if (property.serial) {
		if (!property.key) {
			result.value += " PRIMARY KEY";
		}
		result.value += " AUTOINCREMENT";
	}

    return result;
}