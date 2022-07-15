import { FxOrmSqlDDLSync__Dialect } from '../Typo/Dialect'
export import mysql = require('./mysql')
export import sqlite = require('./sqlite')

export import postgresql = require('./postgresql');
export const mssql = null as FxOrmSqlDDLSync__Dialect.Dialect<Class_DbConnection>