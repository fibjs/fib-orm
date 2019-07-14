export import mysql = require('./mysql')
export import sqlite = require('./sqlite')

export const postgresql = require('./postgresql') as FxOrmSqlDDLSync__Dialect.Dialect
export const mssql = null as FxOrmSqlDDLSync__Dialect.Dialect