---
source_sha256: 81184b869937b2f4d24729a340f422c68ddff4726ef38ced6110d26db5aad254
title: "Elasticsearch 8.x Basics: Mappings, Exact Queries and Full-Text Search"
date: '2015-07-04'
lang: en
translation_key: elasticsearch-basics
permalink: /en/2015/07/04/elasticsearch-basics/
description: "Use Elasticsearch 8.x REST examples to explore mappings, keyword and text fields, exact and full-text queries, refresh visibility, shards and replicas."
---

Elasticsearch builds on Lucene to provide document indexing and search. Start by understanding indexes, field mappings, analyzers and queries rather than relying on a management plugin to produce results.
<!--break-->

## Identify the API version first

Types, head plugin installation and TransportClient examples from 0.90 or 1.x differ considerably from later APIs. These examples use Elasticsearch 8.x REST document paths. Configure authentication, TLS and addresses for your test environment rather than applying old plugin commands to a new service.

Create an isolated demonstration index with explicit purposes for identifiers and names:

```http
PUT /demo-employees
Content-Type: application/json

{"mappings":{"properties":{"employeeId":{"type":"keyword"},"name":{"type":"text"}}}}
```

These blocks represent HTTP requests, not commands for an arbitrary shell. Execute them in a compatible API console or translate them into the chosen client's request format.

```http
PUT /demo-employees/_doc/1
Content-Type: application/json

{"employeeId":"emp1","name":"Alice Smith"}
```

## Separate exact matching from full-text search

```http
GET /demo-employees/_search
Content-Type: application/json

{"query":{"term":{"employeeId":"emp1"}}}
```

The identifier is a keyword suited to exact filtering. The text name is analyzed and uses queries such as match for full-text search. A tokenized field should not be treated as its original string in a term query. Chinese search also needs an analyzer appropriate to the content.

A successful write does not guarantee immediate search visibility. Fetching by ID differs from searching; refresh makes new index segments searchable. Tests can wait explicitly for refresh, but forcing it for every production write is generally inappropriate.

## Move from working queries to maintainable operation

A successful HTTP root response establishes only that a node responds. Check cluster health, primary shard allocation, write errors and whether query results match field semantics.

Replicas provide redundancy and shards hold data. More of either is not automatically better. Plan against volume, queries and recovery goals before indexing, and retain snapshots and rebuild sources. First complete the loop from one document write to exact and full-text queries, then expand the cluster.

**References**

- [Elasticsearch documentation](https://www.elastic.co/guide/en/elasticsearch/reference/8.19/index.html)
