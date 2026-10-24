---
source_sha256: 9bbb6566909aea3d4b42659f204865dbdecf7b2750455a6f15ad71cae4b736c0
title: Getting Started with Redis Data Structures
date: '2015-05-09'
lang: en
translation_key: redis-basics
permalink: /en/2015/05/09/redis-basics/
description: Redis offers more than a string cache. Its data structures support counters, deduplication, ranking and simple queues. Understand command boundaries before deciding how these structures fit business data.
---

Redis offers more than a string cache. Its data structures support counters, deduplication, ranking and simple queues. Understand command boundaries before deciding how these structures fit business data.
<!--break-->

## Explore structures with small examples

Run these commands through redis-cli against an isolated test instance. The demo prefix keeps example keys distinct from business keys:

```text
SET demo:message hello EX 60
GET demo:message
INCR demo:visits
HSET demo:user:1 name Alice
HGET demo:user:1 name
SADD demo:tags java redis
SMEMBERS demo:tags
ZADD demo:ranking 10 alice 20 bob
ZRANGE demo:ranking 0 -1 WITHSCORES
```

Strings work for simple values and counters, hashes for field access, sets for deduplication, and sorted sets for score-based ordering. Collection operations are not interchangeable across types; a command against the wrong type fails.

## One atomic command does not make a workflow atomic

`INCR` is atomic, but reading with GET, calculating and writing with SET are separate steps between which other requests can run. For cross-command conditions, choose transactions, WATCH or scripts according to version and requirements, and understand failure handling.

Caches also need invalidation and update policies. Identify whether the database or cache is the source of truth, then decide expiration, handling of misses for nonexistent data, and concurrent rebuilding. Configure nonexpiring keys and memory eviction behavior explicitly.

## Separate persistence, replication and messaging

RDB snapshots and AOF logs offer different recovery mechanisms. Their potential loss windows depend on configuration and failure conditions. Replication transfers data to replicas; Pub/Sub sends messages to subscribers. They are different protocols. Ordinary Pub/Sub is not a durable task queue with persistent acknowledgments.

For local study, run a server version matching the project and verify it through redis-cli. An old third-party Windows port's maxheap option is not a universal Redis setting. Choose installation methods from official guidance for the target platform, and restrict listening addresses, authentication and network access.

**References**

- [Redis data types](https://redis.io/docs/latest/develop/data-types/)
- [persistence](https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/)
