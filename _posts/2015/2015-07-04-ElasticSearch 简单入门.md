---
layout: post
category : java 
keywords : "开源,搜索,elasticsearch,大数据,入门教程,elasticsearch简单入门"
description: "Elasticsearch 基于 Lucene 提供文档索引与检索服务。入门时最值得先理解的是索引、字段映射、分析器和查询之间的关系，而不是依赖某个管理插件点出结果。"
tags : [开源,搜索,elasticsearch,大数据,入门教程]
lang: zh-CN
translation_key: elasticsearch-basics
---

Elasticsearch 基于 Lucene 提供文档索引与检索服务。入门时最值得先理解的是索引、字段映射、分析器和查询之间的关系，而不是依赖某个管理插件点出结果。
<!--break-->

{% include JB/setup %}

## 先明确 API 所属版本

早期 0.90、1.x 教程中的 type、head 插件安装方式和 TransportClient，与后续版本的 API 差异很大。下面用 Elasticsearch 8.x 的 REST 文档路径举例，认证、TLS 和地址按自己的测试环境配置，不把旧插件命令套用到新服务。

创建一个独立演示索引，明确编号和名称字段的用途：

```http
PUT /demo-employees
Content-Type: application/json

{"mappings":{"properties":{"employeeId":{"type":"keyword"},"name":{"type":"text"}}}}
```

这类块表示 HTTP 请求，不是可以直接粘贴到任意 shell 的命令。可在支持该格式的 API 控制台执行，或转换为所用客户端的请求。

```http
PUT /demo-employees/_doc/1
Content-Type: application/json

{"employeeId":"emp1","name":"Alice Smith"}
```

## 精确匹配与全文检索

```http
GET /demo-employees/_search
Content-Type: application/json

{"query":{"term":{"employeeId":"emp1"}}}
```

编号是 keyword，适合精确过滤；name 是 text，会经过分析，全文搜索时使用 match 等相应查询。分词后的字段不应简单当作原始字符串进行 term 匹配，中文检索还要选择与数据相符的分析器。

写入成功也不保证立刻能通过搜索看到。按 ID 获取和搜索可见性不同，refresh 决定新的索引段何时对搜索可见。测试可以显式等待 refresh，但不宜每条生产写入都强制刷新。

## 从能查询到可维护

HTTP 根地址返回成功，只说明节点能够响应。还需要查看集群健康、主分片是否分配、写入是否报错，以及查询结果是否满足字段语义。

副本提供冗余，分片承载数据，两者数量不是越多越好。建立索引前应根据数据量、查询和恢复目标规划，并保留快照及重建来源。学习时先完成一条文档从写入到精确查询和全文查询的闭环，再扩展集群。

参考：[Elasticsearch 文档](https://www.elastic.co/guide/en/elasticsearch/reference/8.19/index.html)。
