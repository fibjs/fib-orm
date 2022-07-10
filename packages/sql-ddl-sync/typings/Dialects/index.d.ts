/// <reference types="@fibjs/types" />
import { FxOrmSqlDDLSync__Dialect } from '../Typo/Dialect';
export import mysql = require('./mysql');
export import sqlite = require('./sqlite');
export import postgresql = require('./postgresql');
export declare const mssql: FxOrmSqlDDLSync__Dialect.Dialect<Class_DbConnection>;
