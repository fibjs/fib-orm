# 虚拟视图 / virtualView

ORM 中的 model 可以是虚拟视图，也就是说，它不是真实的数据表，而是一个虚拟的数据表，它可以通过一个特定的方式来获取真实的数据表.

## 指定查询源

考虑有以下业务模型, 我们有 `class` 和 `students_info` 两个表. 首先, 我们对这两个表建模:

```js
const Class = db.define("class", {
    no: Number,
    name: String
}, {
});

const StudentInfo = db.define("students_info", {
    stu_no: Number,
    class_no: Number,
    gender: ['male', 'female'],
    grade: Number,
    height: Number,
});
```

现在, 我们想通过一个视图来统计每个班级的学生数量, 男生数量, 平均成绩和平均身高.

以 mysql 为例, 我们预期通过以下查询语句来得到这个视图:

```sql
select `class_no` as `s_class_no`, count(stu_no) as `students_count`, count(gender) as `male_count`, avg(grade) as `avg_grade`, avg(height) as `avg_height` from `students_info` group by `class_no`
```

为此, 我们可以通过 `virtualView` 来定义这个视图:

```js
const StudentInfoStatics = db.define("class_students_statics", {
    class_no: { type: 'integer', mapsTo: 's_class_no' },
    students_count: { type: 'integer' },
    male_count: { type: 'integer' },
    avg_grade: { type: 'number' },
    avg_height: { type: 'number' },
}, {
    virtualView: "(select `class_no` as `s_class_no`, count(stu_no) as `students_count`, count(gender) as `male_count`, avg(grade) as `avg_grade`, avg(height) as `avg_height` from `students_info` group by `class_no`)",
});
```

当执行 `StudentInfoStatics.find().runSync()` 时, 会执行上述的查询语句, 最终我们实际执行的语句如下:

```sql
select `s_class_no`, `students_count`, `male_count`, `avg_grade`, `avg_height` from (select `class_no` as `s_class_no`, count(stu_no) as `students_count`, count(gender) as `male_count`, avg(grade) as `avg_grade`, avg(height) as `avg_height` from `students_info` group by `class_no`) as `class_students_statics` limit 1000
```

可以看到, 最终生成的语句并不是从一个真实的数据表中查询, 而是将一个 `select...as` 作为查询源. 这样, 我们就可以通过一个虚拟视图来统计数据了.

## 特点

### 不可写

当一个 orm model 被指定了 `virtualView` 后, 它像变成一个纯粹的 virtualView model, 其中定义的所有 property 都是**只可读而不可以写**的, 并一一映射到查询源.

virtualView model 就不再映射到一个真实的数据表, 因此, 它**不**支持写入类操作如 `create`, `update`, `remove` 等.

### 依然支持 ChainFind

`model.find()` 会返回一个 `ChainFind` 对象, 通过这个对象, 我们可以对查询结果进行进一步的过滤, 排序, 分页等操作. 这一特性依然适用于 virtualView model.

以上文的 `StudentInfoStatics` 为例, 我们可以按照学生平均成绩对统计信息进行降序排序:

```js
StudentInfoStatics.find().order('-avg_grade').runSync()

// select `s_class_no`, `students_count`, `male_count`, `avg_grade`, `avg_height` from (select `class_no` as `s_class_no`, count(stu_no) as `students_count`, count(gender) as `male_count`, avg(grade) as `avg_grade`, avg(height) as `avg_height` from `students_info` group by `class_no`) as `class_students_statics` order by `avg_grade` DESC limit 1000
```

我们也可以通过 `limit` 和 `offset` 来分页:

```js
StudentInfoStatics.find().limit(10).offset(10).runSync()

// select `s_class_no`, `students_count`, `male_count`, `avg_grade`, `avg_height` from (select `class_no` as `s_class_no`, count(stu_no) as `students_count`, count(gender) as `male_count`, avg(grade) as `avg_grade`, avg(height) as `avg_height` from `students_info` group by `class_no`) as `class_students_statics` limit 10 offset 10
```

也可以通过 `where` 来过滤:

```js
StudentInfoStatics.find().where({ class_no: 1 }).runSync()

// select `s_class_no`, `students_count`, `male_count`, `avg_grade`, `avg_height` from (select `class_no` as `s_class_no`, count(stu_no) as `students_count`, count(gender) as `male_count`, avg(grade) as `avg_grade`, avg(height) as `avg_height` from `students_info` group by `class_no`) as `class_students_statics` where `s_class_no` = 1 limit 1000
```

## 跨数据库定义 virutalView 语句

### 手动区分数据库类型

你的 orm 定义可能是运行在不同数据库 backend 上的, 在定义 virtualView 时, 你可以通过 `db.driver.sqlDriver.type` 来判断当前运行的数据库类型, 然后根据不同的数据库类型来定义不同的 virtualView 语句. 如:

```js
const StudentInfoStatics = db.define("class_students_statics", {
    class_no: { type: 'integer', mapsTo: 's_class_no' },
    students_count: { type: 'integer' },
    male_count: { type: 'integer' },
    avg_grade: { type: 'number' },
    avg_height: { type: 'number' },
}, {
    virtualView: db.driver.sqlDriver.type === 'sqlite' ? "(select `class_no` as `s_class_no`, count(stu_no) as `students_count`, count(gender) as `male_count`, avg(grade) as `avg_grade`, avg(height) as `avg_height` from `students_info` group by `class_no`)"
    : db.driver.sqlDriver.type === 'mysql' ? "(select `class_no` as `s_class_no`, count(stu_no) as `students_count`, count(gender) as `male_count`, avg(grade) as `avg_grade`, avg(height) as `avg_height` from `students_info` group by `class_no`)"
    : db.driver.sqlDriver.type === 'psql' ? `(select "class_no" as "s_class_no", count(stu_no) as "students_count", count(gender) as "male_count", avg(grade) as "avg_grade", avg(height) as "avg_height" from "students_info" group by "class_no")`
    : null,
});
```

### 使用 knex 抹平数据库差异

你也可以使用 [db.driver.knex](../orm-packages/knex.md) 来抹平不同数据库的差异, 如:

```js
const knex = db.driver.knex;

const StudentInfoStatics = db.define("class_students_statics", {
    class_no: { type: 'integer', mapsTo: 's_class_no' },
    students_count: { type: 'integer' },
    male_count: { type: 'integer' },
    avg_grade: { type: 'number' },
    avg_height: { type: 'number' },
}, {
    virtualView: knex.table('students_info').select(
        'class_no as s_class_no',
        knex.raw('count(stu_no) as ??', ['students_count']),
        knex.raw('count(gender) as ??', ['male_count']),
        knex.raw('avg(grade) as ??', ['avg_grade']),
        knex.raw('avg(height) as ??', ['avg_height']),
    ).groupBy(['class_no'])
});
```

**注意** 此时传递给 virtualView 的参数必须是一个 knex 对象, 而不是一个字符串.

关于 knex 的更多用法, 请参考 [knex 文档](https://knexjs.org/).


## 注意事项

- virtualView 中的语句会被直接当做查询源, 因此, 请确保 virtualView 中的语句是正确的.
- 传给 virtualView 的参数如果是字符串, 则必须被引号包裹, 例如: 

```js
// correct
{
    virtualView: "(select * from `students_info` where `class_no` = '1')" 
}

// incorrect
{
    virtualView: "select * from `students_info` where `class_no` = '1'"
}
```