---
layout: post
category : 学习笔记 
keywords: "nutz,源码学习"
description: "Mapl 用 Map 与 List 作为对象结构的容器，方便按路径读取、转换和修改数据。它不是要求每一个叶子值也变成 Map 或 List；数字、字符串等叶子本来就可以直接保留。本文阅读 Nutz 1.b.53 的 ObjCompileImpl。"
tags : [nutz,源码学习]
lang: zh-CN
translation_key: nutz-object-to-mapl
---

Mapl 用 Map 与 List 作为对象结构的容器，方便按路径读取、转换和修改数据。它不是要求每一个叶子值也变成 Map 或 List；数字、字符串等叶子本来就可以直接保留。本文阅读 Nutz 1.b.53 的 ObjCompileImpl。
<!--break-->

{% include JB/setup %}

## 先看类型分派

parse 首先处理 null、枚举、数字、布尔、字符与日期等情况，再处理集合、数组、Map 和普通对象。数组和集合输出为 List，普通对象通过字段描述组装 Map。

```text
对象 -> 类型判断 -> 叶子直接保留
                 -> 容器创建 -> 逐项转换
                 -> POJO字段描述 -> 字段值处理
```

方法名里出现 Json，不意味着这里已经生成 JSON 字符串。结果仍是 Java 内存结构，直到交给序列化器才成为文本。

## memo 处理已遇到的对象

源码在深入容器前，先把目标容器登记到 memo，再填充内容。再次遇到同一键对应的对象时可以返回已有结果，避免无限重复创建。这里使用的是 Map 的键比较机制，不能未经检查就称它为严格按对象身份区分的缓存。

另一个容易忽略的点是分支并不完全对称：这个版本的 map2Json 把条目值加入 Pair，writeItem 直接放入目标 Map；集合元素则逐项调用 parse。不能仅凭“转换为 Mapl”的名字，就推断所有输入会被深度、统一地规范化。

## 结构方便，不代表没有转换代价

Map 键会字符串化，遇到不同对象具有相同文本键时可能覆盖。POJO 字段获取还可能失败，容器中的引用也可能被保留。使用前应验证嵌套 Map、集合、空值和共享引用，确认结果是否适合作为后续接口的中间结构。

参考：[Nutz 1.b.53 ObjCompileImpl 源码](https://repo.maven.apache.org/maven2/org/nutz/nutz/1.b.53/nutz-1.b.53-sources.jar)。
