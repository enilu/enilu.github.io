---
layout: post
category : 大数据 
keywords : "开源,搜索,elasticsearch,大数据,mongodb,mongodb-connector"
description: "产品需要将多个来源的企业数据按唯一标识合并，规模约为三千万条，并支持多维度检索和统计。当时选择 MongoDB 保存文档，Elasticsearch 建立搜索索引，两者之间的同步由独立链路负责。"
tags : [开源,搜索,elasticsearch,大数据,mongodb]
lang: zh-CN
translation_key: mongodb-elasticsearch-synchronization
---

产品需要将多个来源的企业数据按唯一标识合并，规模约为三千万条，并支持多维度检索和统计。当时选择 MongoDB 保存文档，Elasticsearch 建立搜索索引，两者之间的同步由独立链路负责。
<!--break-->

{% include JB/setup %}

## 先确定谁是事实来源

MongoDB 与 Elasticsearch 的职责不同：前者保存合并后的业务文档，后者提供查询视图。不要让两边同时作为可随意修改的主数据，否则冲突时很难决定谁覆盖谁。

企业唯一标识应映射为稳定的索引文档 ID。相同记录重复同步时覆盖同一目标，而不是生成新文档，这是重试能够保持幂等的基础。不同来源对同一字段的优先级、空值是否覆盖，以及删除是否传播，都应先定义。

## 当时的工具尝试

环境使用 Elasticsearch 1.4.4 与 MongoDB 3.2.4。我试过 elasticsearch-river-mongodb，但插件版本与数据库版本耦合，尝试未完成可用部署。Elastic 已说明弃用 river 机制，因此这个插件组合不能作为新项目的部署方案。

当时还考虑过 mongodb-connector，但这里没有一套经过完整验证的安装结果。工具的名字不能代替对版本、变更读取能力和故障恢复方式的确认。

## 全量和增量必须衔接

初次建立索引要扫描已有文档，日常更新则处理新增、修改和删除。两阶段之间要有明确的一致性边界：先记录变更位置，再进行全量并回放期间变化，或使用具备一致性保证的连接器快照机制。具体方法取决于目标版本支持的 oplog、change stream 或连接器能力。

只做全量后才开始监听，可能漏掉扫描期间的修改；无条件重放旧事件，又可能覆盖较新的数据。需要稳定的顺序或版本检查，并记录可恢复的检查点。

## 同步成功要能被证明

| 情况 | 需要的处理 |
|---|---|
| 单条文档写入失败 | 保存失败原因并有界重试，不能只看批次 HTTP 状态 |
| 同步进程重启 | 从已确认位置继续，重放不产生重复文档 |
| 变更日志过期 | 检测缺口，重新做全量或执行可验证的修复 |
| mapping 变化 | 新建索引并校验后切换查询入口 |
| 来源删除记录 | 按明确规则删除或标记目标文档 |

验收时检查文档数、抽样字段和搜索结果，并监控同步延迟与失败数量。索引通常是异步更新的，刚保存就搜索不到时，要区分事件尚未同步和 Elasticsearch refresh 尚未可见，不能立即认定数据丢失。

参考：[Elastic 关于弃用 rivers 的说明](https://www.elastic.co/blog/deprecating-rivers)、[MongoDB Change Streams](https://www.mongodb.com/docs/manual/changeStreams/)。
