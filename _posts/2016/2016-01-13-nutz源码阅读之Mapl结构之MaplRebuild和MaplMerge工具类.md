---
layout: post
category : 学习笔记 
keywords: "nutz,源码学习"
description: "嵌套数据里修改一个字段，常常需要逐层找到 Map 和 List。Nutz 的 MaplRebuild 把路径解析封装起来，MaplMerge 则处理多个结构的合并；两者看似接近，实际语义需要分别确认。本文基于 1.b.53。"
tags : [nutz,源码学习]
lang: zh-CN
translation_key: nutz-mapl-paths-merge
---

嵌套数据里修改一个字段，常常需要逐层找到 Map 和 List。Nutz 的 MaplRebuild 把路径解析封装起来，MaplMerge 则处理多个结构的合并；两者看似接近，实际语义需要分别确认。本文基于 1.b.53。
<!--break-->

{% include JB/setup %}

## 路径修改与读取

Mapl 提供 cell、put、update 和 del 等入口，内部交给路径处理实现。类似 `user[0].name` 的路径，需要区分 Map 的键与 List 下标，并决定中间节点不存在时怎样处理。

索引越界、值类型不符、路径拼错，都不应该被当作“这个字段本来就是空”。若路径由请求提供，还要限制能够修改的字段，避免绕过正常业务更新接口。

## 合并不是统一的覆盖规则

1.b.53 的 MaplMerge 根据首个参数分派：Map 进入 mergeMap，List 进入 mergeList，普通值进入 mergeObj。列表合并通过 contains 去重，比较依赖 equals；普通对象也可以被组织成去重列表，并非所有输入都必须是 Map 或 List。

Map 中同名普通值通常由后值覆盖；后值为 Map/List 且已有值不为 null 时，会进入进一步合并。它不是把所有同名字段无条件变成一个列表，也不是任意异构值都能安全递归。

```text
{a:1} 与 {a:2} -> a 最终为 2
[1,2] 与 [2,3] -> 合并为 [1,2,3]
```

以上展示语义，不是严格 JSON 文本。混合容器类型可能进入不匹配的强制转换，调用方应先检查输入结构。

## 业务覆盖策略应显式定义

配置合并、企业数据汇总和用户补丁，对 null、空列表与同名字段的要求不同。选定工具前，先用冲突样例验证结果，确认是否修改原对象、是否保留嵌套引用，再决定能否直接用于业务。

参考：[Nutz 1.b.53 MaplMerge 源码](https://repo.maven.apache.org/maven2/org/nutz/nutz/1.b.53/nutz-1.b.53-sources.jar)。
