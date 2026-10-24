---
source_sha256: cb837fc0cee6c9bed6d51d9519989e833dda3a9d12f63b0473f9270c6173fcd4
title: Getting Started with MongoDB Documents
date: '2016-05-31'
lang: en
translation_key: mongodb-basics
permalink: /en/2016/05/31/mongodb-basics/
description: MongoDB stores BSON documents and supports organizing nested fields and arrays around business objects. Documents need not have identical structures, but flexible schemas still require field meanings, types and validation rules. Otherwise q
---

MongoDB stores BSON documents and supports organizing nested fields and arrays around business objects. Documents need not have identical structures, but flexible schemas still require field meanings, types and validation rules. Otherwise query and maintenance costs rise over time.
<!--break-->

## Begin with a document and query

Create and query documents in an isolated test database:

```javascript
use demo
db.ent_info.insertOne({ _id: 964, name: "示例企业", shareholders: [{ holderName: "示例股东" }] })
db.ent_info.findOne({ _id: 964 })
db.ent_info.find({ "shareholders.holderName": "示例股东" })
```

Nested fields use dotted paths. Query value types must match stored values: integer 964 and string "964" are not interchangeable. Production systems should define _id types and generation rules explicitly.

## Model access patterns before data volume

Choose embedding or references based on read scope, update frequency and document growth. Data read together with bounded size may fit embedding. Unbounded arrays can create large documents and expensive updates, requiring separation.

MongoDB is not a database without transactions. Single-document operations are atomic, and versions and deployments supporting multi-document transactions offer broader guarantees, with costs and restrictions to evaluate. The 2016 MongoDB 3.2 environment cannot use APIs introduced in later versions.

## Plan indexes and client lifecycle

Build indexes around actual filters and sorts, and inspect scan scope with explain. Larger collections do not automatically query efficiently. Replica sets also do not distribute portions of one dataset across all members; sharding is a separate scaling mechanism.

The Java 3.x MongoClient and later driver APIs differ. Keep connection, authentication, timeout and close handling aligned to one version. Reuse the client inside the application rather than creating a new connection pool for each request. `find` returns iterable results; explicitly use first or its version equivalent for one record, and handle absence.

Restrict listening scope in local experiments, and define authentication, authorization and backups in production. After establishing a connection, verify inserts, updates, deletions, type differences and invalid inputs too.

**References**

- [Documentation: www.mongodb.com](https://www.mongodb.com/docs/manual/data-modeling/)
- [transactions](https://www.mongodb.com/docs/manual/core/transactions/)
