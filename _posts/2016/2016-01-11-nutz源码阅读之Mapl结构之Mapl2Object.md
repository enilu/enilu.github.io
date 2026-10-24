---
layout: post
category : 学习笔记 
keywords: "nutz,源码学习"
description: "把 Map/List 结构恢复成 Java 对象，需要同时知道源值和目标类型。Nutz 1.b.53 的 ObjConvertImpl 将容器递归注入与叶子值转换分开，阅读时抓住这两层，比逐个跟进所有 if 分支更清楚。"
tags : [nutz,源码学习]
lang: zh-CN
translation_key: nutz-mapl-to-object
---

把 Map/List 结构恢复成 Java 对象，需要同时知道源值和目标类型。Nutz 1.b.53 的 ObjConvertImpl 将容器递归注入与叶子值转换分开，阅读时抓住这两层，比逐个跟进所有 if 分支更清楚。
<!--break-->

{% include JB/setup %}

## 两种类型入口

Mapl.maplistToT 接受 Class，maplistToObj 接受 Type。后者可以保留更多泛型信息；只有 List.class 时，不能据此推断列表里的每个元素都是业务实体。

convert 遇到非 Map/List 输入，会尝试通过 Castors 转为目标类型；容器则交给 inject，按目标属于集合、Map、数组或 POJO 继续处理。

## 递归由目标结构驱动

```text
源 Map/List + 目标 Type
    -> 集合：确定元素类型，逐项转换
    -> Map：处理键和值的类型
    -> 数组：确定组件类型，分配数组并填入
    -> POJO：创建实例，读取字段类型并注入
```

对于叶子值，Castors 承担字符串、数字等转换。创建实例和设置字段又依赖反射层，源结构与目标不兼容时，不能期待转换器自动决定业务含义。

## 看懂成功路径后，再检查失败

缺失字段、null、不可解析的数值和溢出，各自需要明确策略。结构转换不等于请求校验；若输入来自外部，还应限制可写字段，避免将一个任意 Map 直接灌入包含权限或状态字段的实体。

该版本源码还对循环引用留下了处理风险提示，因此不能从正向转换的 memo 机制推断反向转换也支持任意循环对象图。用单层、嵌套、泛型及失败输入分别验证，才能判断它是否适合自己的数据。

参考：[Nutz 1.b.53 ObjConvertImpl 源码](https://repo.maven.apache.org/maven2/org/nutz/nutz/1.b.53/nutz-1.b.53-sources.jar)。
