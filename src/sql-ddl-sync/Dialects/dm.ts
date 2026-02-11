import FxORMCore = require("../../orm-core/index");
import { IProperty, transformer } from "../../orm-property/index";

import SQL = require("../SQL");
import { FxOrmSqlDDLSync__DbIndex } from "../Typo/DbIndex";
import { FxOrmSqlDDLSync__Dialect } from "../Typo/Dialect";
import { getSqlQueryDialect, arraify } from '../Utils';

const Transformer = transformer('dm')

type IDialect = FxOrmSqlDDLSync__Dialect.Dialect<Class_DbConnection>;

export const convertIndexes: IDialect['convertIndexes'] = function (
    collection, index_defs
) {
    const prefix = `${collection}_`;
    return index_defs.map(indexDef => {
        if (indexDef.name && indexDef.name.startsWith(prefix)) {
            return indexDef;
        }
        return {
            ...indexDef,
            name: `${prefix}${indexDef.name}`
        };
    });
};

function fetchPrimaryKeys(dbdriver: any, name: string) {
    const rows = dbdriver.execute(
        getSqlQueryDialect('dm').escape(
            [
                "SELECT col.COLUMN_NAME ",
                "FROM ALL_CONSTRAINTS con ",
                "JOIN ALL_CONS_COLUMNS col ",
                "ON con.CONSTRAINT_NAME = col.CONSTRAINT_NAME AND con.OWNER = col.OWNER ",
                "WHERE con.CONSTRAINT_TYPE = 'P' ",
                "AND con.TABLE_NAME = UPPER(?) ",
                "AND con.OWNER = USER"
            ].join(''),
            [name]
        )
    );

    const set = new Set<string>();
    rows.forEach((row: any) => {
        const col = row.COLUMN_NAME || row.column_name;
        if (col) set.add(String(col));
    });
    return set;
}

export const hasCollectionSync: IDialect['hasCollectionSync'] = function (
    dbdriver, name
): boolean {
    const rows = dbdriver.execute(
        getSqlQueryDialect('dm').escape(
            "SELECT TABLE_NAME FROM ALL_TABLES WHERE TABLE_NAME = UPPER(?) AND OWNER = USER",
            [name]
        )
    ) as any[]
    return rows.length > 0;
};

export const hasCollection: IDialect['hasCollection'] = function (
    dbdriver, name, cb
) {
    const exposedErrResults = FxORMCore.Utils.exposeErrAndResultFromSyncMethod(
        () => hasCollectionSync(dbdriver, name)
    )
    FxORMCore.Utils.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: true, callback: cb });
};

export const addPrimaryKeySync: IDialect['addPrimaryKeySync'] = function (
    dbdriver, tableName, columnName
) {
    return dbdriver.execute(
        getSqlQueryDialect('dm').escape(
            "ALTER TABLE ?? ADD CONSTRAINT ?? PRIMARY KEY(??)",
            [tableName, columnName + "_PK", columnName]
        )
    )
};

export const addPrimaryKey: IDialect['addPrimaryKey'] = function (
    dbdriver, tableName, columnName, cb
) {
    const exposedErrResults = FxORMCore.Utils.exposeErrAndResultFromSyncMethod(
        () => addPrimaryKeySync(dbdriver, tableName, columnName)
    )
    FxORMCore.Utils.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: true, callback: cb });
};

export const dropPrimaryKeySync: IDialect['dropPrimaryKeySync'] = function (
    dbdriver, tableName, columnName
) {
    return dbdriver.execute(
        getSqlQueryDialect('dm').escape(
            "ALTER TABLE ?? DROP PRIMARY KEY",
            [tableName]
        )
    )
};

export const dropPrimaryKey: IDialect['dropPrimaryKey'] = function (
    dbdriver, tableName, columnName, cb
) {
    const exposedErrResults = FxORMCore.Utils.exposeErrAndResultFromSyncMethod(
        () => dropPrimaryKeySync(dbdriver, tableName, columnName)
    )
    FxORMCore.Utils.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: true, callback: cb });
};

export const addForeignKeySync: IDialect['addForeignKeySync'] = function (
    dbdriver, tableName, options
) {
    return dbdriver.execute(
        getSqlQueryDialect('dm').escape(
            "ALTER TABLE ?? ADD CONSTRAINT ?? FOREIGN KEY(??) REFERENCES ??(??)",
            [tableName, options.name + "_fk", options.name, options.references.table, options.references.column]
        )
    )
};

export const addForeignKey: IDialect['addForeignKey'] = function (
    dbdriver, tableName, options, cb
) {
    const exposedErrResults = FxORMCore.Utils.exposeErrAndResultFromSyncMethod(
        () => addForeignKeySync(dbdriver, tableName, options)
    )
    FxORMCore.Utils.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: true, callback: cb });
};

export const dropForeignKeySync: IDialect['dropForeignKeySync'] = function (
    dbdriver, tableName, columnName
) {
    return dbdriver.execute(
        getSqlQueryDialect('dm').escape(
            "ALTER TABLE ?? DROP CONSTRAINT ??",
            [tableName, columnName + "_fk"]
        )
    )
};

export const dropForeignKey: IDialect['dropForeignKey'] = function (
    dbdriver, tableName, columnName, cb
) {
    const exposedErrResults = FxORMCore.Utils.exposeErrAndResultFromSyncMethod(
        () => dropForeignKeySync(dbdriver, tableName, columnName)
    )
    FxORMCore.Utils.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: true, callback: cb });
};

export const getCollectionColumnsSync: IDialect['getCollectionColumnsSync'] = function (
    dbdriver, name
) {
    return (dbdriver.execute(
        getSqlQueryDialect('dm').escape(
            "SELECT c.*, cc.COMMENTS FROM ALL_TAB_COLUMNS c LEFT JOIN ALL_COL_COMMENTS cc ON c.OWNER = cc.OWNER AND c.TABLE_NAME = cc.TABLE_NAME AND c.COLUMN_NAME = cc.COLUMN_NAME WHERE c.TABLE_NAME = UPPER(?) AND c.OWNER = USER ORDER BY c.COLUMN_ID",
            [name]
        )
    ) as any[]).map((row: any) => Transformer.filterRawColumns(row as any)) as any
}

export const getCollectionColumns: IDialect['getCollectionColumns'] = function (
    dbdriver, name, cb
) {
    const exposedErrResults = FxORMCore.Utils.exposeErrAndResultFromSyncMethod(
        () => getCollectionColumnsSync(dbdriver, name)
    )
    FxORMCore.Utils.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: true, callback: cb });
};

export const getCollectionPropertiesSync: IDialect['getCollectionPropertiesSync'] = function (
    dbdriver, name
) {
    const cols = getCollectionColumnsSync(dbdriver, name)
    const pkSet = fetchPrimaryKeys(dbdriver as any, name);

    const props = <{ [col: string]: IProperty }>{};

    for (let i = 0; i < cols.length; i++) {
        const colInfo = cols[i];
        const mapsToRaw = colInfo.COLUMN_NAME || colInfo.column_name;
        const mapsTo = mapsToRaw !== undefined ? String(mapsToRaw) : '';
        const prop = Transformer.rawToProperty(colInfo, {
            collection: name,
        }).property;

        if (mapsTo && pkSet.has(String(mapsTo))) {
            prop.primary = true;
            prop.key = true;
        }

        if (mapsTo) props[mapsTo] = prop;
    }

    return props;
};

export const getCollectionProperties: IDialect['getCollectionProperties'] = function (
    dbdriver, name, cb
) {
    const exposedErrResults = FxORMCore.Utils.exposeErrAndResultFromSyncMethod(
        () => getCollectionPropertiesSync(dbdriver, name)
    )
    FxORMCore.Utils.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: true, callback: cb });
};

export const createCollectionSync: IDialect['createCollectionSync'] = function (
    dbdriver, name, columns, keys, opts
) {
    return dbdriver.execute(
        SQL.CREATE_TABLE({
            name: name,
            columns: columns,
            keys: keys,
            comment: opts.comment
        }, 'dm')
    )
};

export const createCollection: IDialect['createCollection'] = function (
    dbdriver, name, columns, keys, opts, cb
) {
    const exposedErrResults = FxORMCore.Utils.exposeErrAndResultFromSyncMethod(
        () => createCollectionSync(dbdriver, name, columns, keys, opts)
    )
    FxORMCore.Utils.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: true, callback: cb });
};

export const dropCollectionSync: IDialect['dropCollectionSync'] = function (
    dbdriver, name
) {
    return dbdriver.execute(
        SQL.DROP_TABLE({ name: name }, 'dm')
    )
};

export const dropCollection: IDialect['dropCollection'] = function (
    dbdriver, name, cb
) {
    const exposedErrResults = FxORMCore.Utils.exposeErrAndResultFromSyncMethod(
        () => dropCollectionSync(dbdriver, name)
    )
    FxORMCore.Utils.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: true, callback: cb });
};

export const hasCollectionColumnsSync: IDialect['hasCollectionColumnsSync'] = function (
    dbdriver, name, column
) {
    const columns = arraify(column)
    let res: null | any[] = null, has = false
    try {
        has = columns.every(
            columnName =>
                (res = dbdriver.execute(
                    SQL.CHECK_TABLE_HAS_COLUMN({
                        name: name,
                        column: columnName,
                    }, 'dm')
                )) && !!(res && res.length)
        )
    } catch (error) {
        has = false
    }

    return has
};

export const hasCollectionColumns: IDialect['hasCollectionColumns'] = function (
    dbdriver, name, column, cb
) {
    const exposedErrResults = FxORMCore.Utils.exposeErrAndResultFromSyncMethod(
        () => hasCollectionColumnsSync(dbdriver, name, column)
    )
    FxORMCore.Utils.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: true, callback: cb });
};

export const addCollectionColumnSync: IDialect['addCollectionColumnSync'] = function (
    dbdriver, name, column, after_column
) {
    return dbdriver.execute(
        SQL.ALTER_TABLE_ADD_COLUMN({
            name: name,
            column: column,
            after: after_column,
            first: !after_column
        }, 'dm')
    )
};

export const addCollectionColumn: IDialect['addCollectionColumn'] = function (
    dbdriver, name, column, after_column, cb
) {
    const exposedErrResults = FxORMCore.Utils.exposeErrAndResultFromSyncMethod(
        () => addCollectionColumnSync(dbdriver, name, column, after_column)
    )
    FxORMCore.Utils.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: true, callback: cb });
};

export const renameCollectionColumnSync: IDialect['renameCollectionColumnSync'] = function (
    dbdriver, name, oldColName, newColName
) {
    return dbdriver.execute(
        SQL.ALTER_TABLE_RENAME_COLUMN({
            name: name,
            oldColName: oldColName,
            newColName: newColName
        }, 'dm')
    )
};

export const renameCollectionColumn: IDialect['renameCollectionColumn'] = function (
    dbdriver, name, oldColName, newColName, cb
) {
    const exposedErrResults = FxORMCore.Utils.exposeErrAndResultFromSyncMethod(
        () => renameCollectionColumnSync(dbdriver, name, oldColName, newColName)
    )
    FxORMCore.Utils.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: true, callback: cb });
};

export const modifyCollectionColumnSync: IDialect['modifyCollectionColumnSync'] = function (
    dbdriver, name, column
) {
    return dbdriver.execute(
        SQL.ALTER_TABLE_MODIFY_COLUMN({
            name: name,
            column: column
        }, 'dm')
    )
};

export const modifyCollectionColumn: IDialect['modifyCollectionColumn'] = function (
    dbdriver, name, column, cb
) {
    const exposedErrResults = FxORMCore.Utils.exposeErrAndResultFromSyncMethod(
        () => modifyCollectionColumnSync(dbdriver, name, column)
    )
    FxORMCore.Utils.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: true, callback: cb });
};

export const dropCollectionColumnSync: IDialect['dropCollectionColumnSync'] = function (
    dbdriver, name, column
) {
    return dbdriver.execute(
        SQL.ALTER_TABLE_DROP_COLUMN({
            name: name,
            column: column
        }, 'dm')
    )
};

export const dropCollectionColumn: IDialect['dropCollectionColumn'] = function (
    dbdriver, name, column, cb
) {
    const exposedErrResults = FxORMCore.Utils.exposeErrAndResultFromSyncMethod(
        () => dropCollectionColumnSync(dbdriver, name, column)
    )
    FxORMCore.Utils.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: true, callback: cb });
};

export const getCollectionIndexesSync: IDialect['getCollectionIndexesSync'] = function (
    dbdriver, name
) {
    const indexRows = dbdriver.execute(
        getSqlQueryDialect('dm').escape(
            [
                "SELECT i.INDEX_NAME, i.UNIQUENESS, c.COLUMN_NAME ",
                "FROM ALL_INDEXES i ",
                "JOIN ALL_IND_COLUMNS c ",
                "ON i.INDEX_NAME = c.INDEX_NAME AND i.TABLE_NAME = c.TABLE_NAME AND i.OWNER = c.INDEX_OWNER ",
                "WHERE i.TABLE_NAME = UPPER(?) AND i.OWNER = USER"
            ].join(''),
            [name]
        )
    ) as any[]

    const pkRows = dbdriver.execute(
        getSqlQueryDialect('dm').escape(
            [
                "SELECT CONSTRAINT_NAME ",
                "FROM ALL_CONSTRAINTS ",
                "WHERE CONSTRAINT_TYPE = 'P' ",
                "AND TABLE_NAME = UPPER(?) ",
                "AND OWNER = USER"
            ].join(''),
            [name]
        )
    ) as any[]

    const pkIndexSet = new Set<string>();
    pkRows.forEach((row: any) => {
        const cname = row.CONSTRAINT_NAME || row.constraint_name;
        if (cname) pkIndexSet.add(String(cname));
    });

    return convertIndexRows(indexRows, pkIndexSet);
};

export const getCollectionIndexes: IDialect['getCollectionIndexes'] = function (
    dbdriver, name, cb
) {
    const exposedErrResults = FxORMCore.Utils.exposeErrAndResultFromSyncMethod(
        () => getCollectionIndexesSync(dbdriver, name)
    )
    FxORMCore.Utils.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: true, callback: cb });
};

export const addIndexSync: IDialect['addIndexSync'] = function (
    dbdriver, indexName, unique, collection, columns
) {
    return dbdriver.execute(
        SQL.CREATE_INDEX({
            name: indexName,
            unique: unique,
            collection: collection,
            columns: columns
        }, 'dm')
    )
};

export const addIndex: IDialect['addIndex'] = function (
    dbdriver, indexName, unique, collection, columns, cb
) {
    const exposedErrResults = FxORMCore.Utils.exposeErrAndResultFromSyncMethod(
        () => addIndexSync(dbdriver, indexName, unique, collection, columns)
    )
    FxORMCore.Utils.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: true, callback: cb });
};

export const removeIndexSync: IDialect['removeIndexSync'] = function (
    dbdriver, collection, name
) {
    return dbdriver.execute(
        SQL.DROP_INDEX({
            name: name,
            collection: collection
        }, 'dm')
    )
};

export const removeIndex: IDialect['removeIndex'] = function (
    dbdriver, collection, name, cb
) {
    const exposedErrResults = FxORMCore.Utils.exposeErrAndResultFromSyncMethod(
        () => removeIndexSync(dbdriver, collection, name)
    )
    FxORMCore.Utils.throwErrOrCallabckErrResult(exposedErrResults, { no_throw: true, callback: cb });
};

export const toRawType: IDialect['toRawType'] = function (
    property, ctx
) {
    return Transformer.toStorageType(property, {
        collection: ctx.collection,
        customTypes: ctx.driver?.customTypes,
        escapeVal: getSqlQueryDialect(ctx.driver?.type || 'dm').escapeVal
    });
};

function convertIndexRows(
    rows: any[],
    pkIndexSet: Set<string>
): Record<string, FxOrmSqlDDLSync__DbIndex.DbIndexInfo> {
    const indexes = <Record<string, FxOrmSqlDDLSync__DbIndex.DbIndexInfo>>{};

    for (let i = 0; i < rows.length; i++) {
        const index_name = rows[i].INDEX_NAME || rows[i].index_name;
        const uniqueness = rows[i].UNIQUENESS || rows[i].uniqueness;
        const column_name = rows[i].COLUMN_NAME || rows[i].column_name;

        if (!index_name || pkIndexSet.has(String(index_name))) {
            continue;
        }

        if (/^INDEX\d+$/i.test(String(index_name))) {
            continue;
        }

        if (!indexes.hasOwnProperty(index_name)) {
            indexes[index_name] = {
                columns: [],
                unique: String(uniqueness).toUpperCase() === 'UNIQUE'
            };
        }

        indexes[index_name].columns.push(column_name);
    }

    return indexes;
}
