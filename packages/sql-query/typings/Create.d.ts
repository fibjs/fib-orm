import { FxSqlQueryDialect } from "./Typo/Dialect";
import { FxSqlQueryColumns } from "./Typo/Field";
import { FxSqlQueryChainBuilder } from "./Typo/Query-ChainBuilder";
/**
 * Instantiate a new CREATE-type query builder
 * @param Dialect
 * @returns {{table: table, field: field, fields: fields, build: build}}
 * @constructor
 */
export declare class CreateQuery implements FxSqlQueryChainBuilder.ChainBuilder__Create {
    private Dialect;
    tableName: string;
    structure: FxSqlQueryColumns.FieldItemTypeMap;
    constructor(Dialect: FxSqlQueryDialect.Dialect);
    /**
     * Set the table name
     * @param table_name
     * @returns {*}
     */
    table(table_name: string): this;
    /**
     * Add a field
     * @param name
     * @param type
     * @returns {Object}
     */
    field(name: string, type: FxSqlQueryDialect.DialectFieldType): this;
    /**
     * Set all the fields
     * @param fields
     * @returns {Object}
     */
    fields(fields?: FxSqlQueryColumns.FieldItemTypeMap): any;
    /**
     * Build a query from the passed params
     * @returns {string}
     */
    build(): string;
}
