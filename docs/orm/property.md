# Property <Badge type="warning">WIP</Badge>

Property 是 ORM 中定义 model 的基础元素, 一个 Property 被认为是典型的数据库表中的一个字段在 model 上的**映射**.

## 声明 Property

在创建一个 model 时, 声明 Property 最必要的:

```js
var User = db.define('user', {
    name: String
});
```

我们声明了一个名为 `name` 的 Property, 其类型为 `String`, 它等价于这样的定义:

```js
var User = db.define('user', {
    name: {
        type: 'text'
    }
});
```

这两种声明**完全等价**, 第一种风格是基于 Function 的简写(参考[简写](#简写)); 但第二种风格是**完整声明**, 允许我们为 `name` 这个 Property 指定更多的特性和行为.

orm 的 Property 能力由 [@fxjs/orm-property](../orm-packages/orm-property.md) 支持.