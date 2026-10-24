---
source_sha256: 6fd672288edfc18bb39522f7c335d2ccf73d0e5cee2bd61dfc19f2ef3dc486f8
title: Notes on Building High-Performance Websites
date: '2014-07-25'
lang: en
translation_key: high-performance-web-reading-notes
permalink: /en/2014/07/25/high-performance-web-reading-notes/
description: While reading about high-performance websites, I treated caching, load balancing and database scaling as choices at different points in one request path. They solve different problems. Locating the bottleneck first establishes where an inve
---

While reading about high-performance websites, I treated caching, load balancing and database scaling as choices at different points in one request path. They solve different problems. Locating the bottleneck first establishes where an investment is useful.
<!--break-->

## Draw the request path first

```text
Browser -> DNS/entry point -> Reverse proxy -> Application -> Cache or database
```

Every layer can add waiting. Measure volume, latency percentiles, errors and resource use to distinguish slow queries, pool waits, CPU work and network transfer. An improving average can conceal a worsening tail.

## Understand load-balancing boundaries

| Method | Where selection happens | Main considerations |
|---|---|---|
| HTTP redirect | Server returns another address; client requests again | Extra round trip, client behavior and destination reachability |
| Multiple DNS addresses | During name resolution | Caching, TTL, health checks and failure propagation |
| Reverse proxy | Proxy chooses and forwards to a backend | Timeouts, connections, TLS overhead and proxy redundancy |
| Layer 4 scheduling | Connection or packet forwarding | Connection state, topology and return paths |

DNS caching reduces lookups without making DNS capacity unlimited. Kernel forwarding still consumes CPU, packet-processing capacity and connection state; bandwidth is not the only limit. NAT is not complete access control. LVS-DR and tunnel modes have their own network requirements.

Session affinity can reduce switching between session locations, but IP hash neither isolates user identities nor recovers state after node failure. Choose shared sessions, statelessness or affinity according to application requirements.

## Plan cache updates

Caching removes repeated work while introducing expiry, concurrent rebuilding and stale data. Establish the source of truth before choosing update or invalidation behavior. Static assets can use content hashes. Personalized or authorized responses need explicit cache keys and sharing scope.

## Database scaling changes semantics too

Read/write separation must address replication lag and read-after-write consistency; replicas do not replace backups. Sharding affects unique keys, transactions, joins and migration. Time-based partitioning helps lifecycle management, while key distribution requires planning for hot spots and expansion.

Do not introduce every mechanism at once. Make one measurable adjustment to a bottleneck, compare equivalent load and preserve rollback. Performance gains should come from measurement rather than component counts.

**References**

- [Nginx HTTP load balancing](https://nginx.org/en/docs/http/load_balancing.html)
