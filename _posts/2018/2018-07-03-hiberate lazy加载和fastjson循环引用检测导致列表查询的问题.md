---
layout: post
category : java 
keywords : "fastjson,延迟加载,循环引用检测"
description: "分页接口返回机构名称时，列表中前一条记录的 org 是完整对象，后面却出现了 $ref，前端直接读取 org.name 因而失败。这个问题需要分开看两个层次：数据库关联是否已加载，以及序列化如何表示同一个对象。"
tags : [fastjson,hibernate,java]
lang: zh-CN
translation_key: hibernate-lazy-loading-json-references
---

分页接口返回机构名称时，列表中前一条记录的 `org` 是完整对象，后面却出现了 `$ref`，前端直接读取 `org.name` 因而失败。这个问题需要分开看两个层次：数据库关联是否已加载，以及序列化如何表示同一个对象。
<!--break-->

{% include JB/setup %}

## 重复引用和懒加载不是一回事

例如多条记录关联同一个机构，在同一持久化上下文中，它们可能引用同一个 Org 实例。Fastjson 1.x 的引用检测可以把后续出现的同一对象输出为路径引用：

```json
{
  "rows": [
    {"id": 1, "org": {"id": 7, "name": "示例机构"}},
    {"id": 2, "org": {"$ref": "$.rows[0].org"}}
  ]
}
```

这里 JSON 本身可以解析，但普通前端代码不会自动将 `$ref` 解引用。重复引用也不一定形成循环：两条记录共享一个机构，与机构反过来引用这些记录，是两种不同对象图。

Hibernate 的懒加载决定关联何时取数，代理对象的访问可能触发查询，也可能在持久化上下文关闭后失败。看到 `$ref` 只能说明序列化表示里存在引用，不能单凭它认定是代理类“无法解析”。

## 让接口返回独立的数据结构

更容易维护的办法，是按接口需求查询并组装 DTO，只返回前端需要的字段：

```json
{
  "rows": [
    {"id": 1, "orgId": 7, "orgName": "示例机构"},
    {"id": 2, "orgId": 7, "orgName": "示例机构"}
  ]
}
```

在查询或映射阶段取到名称，并关注 SQL 次数；避免每映射一条记录就额外查询一次。分页下使用 join fetch、投影或批量查询时，也要验证总数、重复行与分页是否符合预期。

## 配置开关只能解决对应的问题

在 Fastjson 1.x 中，`SerializerFeature.DisableCircularReferenceDetect` 可以关闭引用检测，使共享对象被重复展开。但如果对象图真的存在循环，关闭检测可能造成递归或栈溢出。因此不能把它设为所有实体接口的默认修复方案。

将关联从 LAZY 改成 EAGER 同样不会消除对象共享关系，还可能增加无用查询或返回过大的对象图。应先明确接口需要什么数据，再控制取数和输出结构。

Fastjson2 的选项与默认行为需要按对应版本确认，不应直接复制 1.x 配置。验证时至少准备无关联、共享机构、双向关联及会话关闭后的数据，检查 JSON 结构和数据库查询数量。

参考：[Fastjson2 迁移说明](https://github.com/alibaba/fastjson2/wiki/fastjson_1_upgrade_cn)、[Hibernate ORM 用户指南](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)。
