---
source_sha256: a1d5f210c7ba62f2489030261fc068b71123eac98fd480af09aa051aa890ffb6
title: Synchronizing MongoDB Documents to Elasticsearch
date: '2016-05-26'
lang: en
translation_key: mongodb-elasticsearch-synchronization
permalink: /en/2016/05/26/mongodb-elasticsearch-synchronization/
description: A product needed to merge company data from several sources by a unique identifier, at a scale of roughly 30 million records, and support multidimensional search and aggregation. We stored the merged documents in MongoDB and built search in
---

A product needed to merge company data from several sources by a unique identifier, at a scale of roughly 30 million records, and support multidimensional search and aggregation. We stored the merged documents in MongoDB and built search indexes in Elasticsearch, with a separate synchronization pipeline connecting them.
<!--break-->

## Establish the source of truth

MongoDB holds the merged business document; Elasticsearch supplies a query view. If both become freely editable primary stores, conflicts become difficult to resolve.

Map each company's unique identifier to a stable index document ID. Replaying a record should replace the same target document rather than create another one. That is the foundation of idempotent retries. Define source priority for conflicting fields, whether null overwrites existing data, and whether deletions propagate.

## The tools I tried

The environment used Elasticsearch 1.4.4 and MongoDB 3.2.4. I tried elasticsearch-river-mongodb, but the plugin was coupled to database versions and I did not complete a usable deployment. Elastic deprecated the river mechanism, so this combination is not a deployment recommendation for new projects.

I also considered mongodb-connector, but do not have a fully verified installation to present here. Naming a tool does not establish version compatibility, change capture capabilities or recovery behavior.

## Connect the initial snapshot to incremental changes

Initial indexing scans existing documents; ongoing synchronization processes inserts, updates and deletions. Define a consistency boundary between them: record a change position before scanning and replay intervening changes, or use a connector's consistent snapshot mechanism. The implementation depends on the target version's oplog, change stream or connector capabilities.

Starting change capture only after the scan can miss changes made during it. Unconditionally replaying old events can overwrite newer data. Use stable ordering or version checks and persist recoverable checkpoints.

## Make successful synchronization demonstrable

| Situation | Required handling |
|---|---|
| One document fails to write | Record the reason and retry within bounds; a batch HTTP status is insufficient |
| Synchronizer restarts | Resume from a confirmed position; replay must not duplicate documents |
| Change history expires | Detect the gap and rebuild or perform a verifiable repair |
| Mapping changes | Build and validate a new index before switching queries |
| A source record is deleted | Delete or mark the target according to explicit rules |

Check document counts, sample fields and search results during acceptance. Monitor lag and failures. Indexing is generally asynchronous: a missing search result immediately after saving can mean an event has not arrived or Elasticsearch refresh has not made it visible. Neither immediately proves data loss.

**References**

- [Documentation: www.elastic.co](https://www.elastic.co/blog/deprecating-rivers)
- [MongoDB Change Streams](https://www.mongodb.com/docs/manual/changeStreams/)
