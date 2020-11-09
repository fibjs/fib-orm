import { FxOrmSqlDDLSync__Dialect } from '../Typo/Dialect'
export import mysql = require('./mysql')
export import sqlite = require('./sqlite')

// export const postgresql = require('./postgresql') as FxOrmSqlDDLSync__Dialect.Dialect
export const postgresql = null as FxOrmSqlDDLSync__Dialect.Dialect
export const mssql = null as FxOrmSqlDDLSync__Dialect.Dialect