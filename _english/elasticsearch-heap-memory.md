---
source_sha256: 5e5f2c091eeee3a34272b4cf10fd999b6247bd186cf71c8ead6f4b65b1079862
title: Investigating Elasticsearch Heap Exhaustion
date: '2016-04-26'
lang: en
translation_key: elasticsearch-heap-memory
permalink: /en/2016/04/26/elasticsearch-heap-memory/
description: 'When production Elasticsearch reports OutOfMemoryError: Java heap space, heap sizing deserves investigation. A successful restart alone is insufficient, however. Query parameters in the error may reveal a request pattern that continues cons'
---

When production Elasticsearch reports `OutOfMemoryError: Java heap space`, heap sizing deserves investigation. A successful restart alone is insufficient, however. Query parameters in the error may reveal a request pattern that continues consuming memory.
<!--break-->

## Read more than the OOM message

The log included `from[12700000],size[100000]`. Deep pagination combined with large results requires processing many candidates. An overnight failure does not rule out a background task or repeated retries.

Record request sources, concurrency, shard distribution and sorting, then correlate heap, GC and query load. Failure time alone cannot establish that queries were harmless.

## Confirm the runtime configuration

Older 1.x and 2.x environments used `ES_HEAP_SIZE`. Later versions use different JVM configuration and may size the heap automatically. Inspect actual startup arguments and node statistics instead of assuming a file edit changed the running value.

```http
GET /_nodes/stats/jvm
```

Inspect heap_used, heap_max and GC fields together with node, container and operating-system memory limits. File cache and native allocations need memory outside the Java heap. Use version-specific official guidance and measurements rather than increasing heap indefinitely.

## Change requests to prevent recurrence

Bound interactive page depth and page size. For exports, use version-appropriate scroll or PIT with search_after, and release contexts promptly. These mechanisms have different semantics and resource costs; replacing from with another parameter is not the entire solution.

Inspect aggregation bucket counts, sort fields, mappings and client retries after timeouts. Retrying one expensive request repeatedly can multiply the original pressure.

Retest identical samples after changes and observe a full business cycle. Completing work reliably within a smaller resource budget is more useful than merely postponing the next OOM.

**References**

- [JVM settings](https://www.elastic.co/guide/en/elasticsearch/reference/8.19/advanced-configuration.html)
- [Paginating search results](https://www.elastic.co/guide/en/elasticsearch/reference/8.19/paginate-search-results.html)
