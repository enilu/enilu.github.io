---
source_sha256: c9f0370eee6f938414d6d933c268e3e67b287423d63d315486f956e4fa51f135
title: Understanding and Setting Up a Redis 3.0.5 Cluster
date: '2015-11-28'
lang: en
translation_key: redis-3-cluster
permalink: /en/2015/11/28/redis-3-cluster/
description: Redis Cluster distributes a keyspace across nodes and uses replication and failover to improve availability. This Redis 3.0.5 example explains a six-process learning setup. Six processes on one machine are not a production high-availability
---

Redis Cluster distributes a keyspace across nodes and uses replication and failover to improve availability. This Redis 3.0.5 example explains a six-process learning setup. Six processes on one machine are not a production high-availability deployment.
<!--break-->

## Sharding uses hash slots

Cluster has 16,384 hash slots, with each primary responsible for a subset. A client determines the slot and sends the request to its node, handling MOVED and ASK responses according to the protocol. Multi-key operations are not categorically unsupported: they generally require keys in one slot, and hash tags control colocating keys.

Three primaries with one replica each form a common learning topology. Placing replicas on different machines and failure domains directly affects fault tolerance. Counting processes alone does not establish it.

## Give every process its own directory

This is an illustrative configuration for port 7000. Change ports and data paths for the other nodes:

```ini
port 7000
bind 127.0.0.1
cluster-enabled yes
cluster-config-file nodes.conf
cluster-node-timeout 5000
appendonly yes
dir /path/to/redis-cluster/7000
```

Create directories in advance. Nodes must not share writable nodes.conf or data files. Loopback binding is suitable only for a single-machine test. Across machines, configure reachable addresses, required ports and access controls.

Cluster also needs node communication ports, commonly the client port plus 10000 in Redis 3.0. Opening client ports alone is insufficient.

## Create and verify the cluster

Redis 3.0.5 uses the distribution's `redis-trib.rb` with the corresponding Ruby environment. Newer releases provide `redis-cli --cluster`; do not mix their commands. After starting nodes, use the matching tool to allocate slots and replicas.

```text
redis-cli -c -p 7000
CLUSTER INFO
CLUSTER NODES
```

Check complete slot allocation and expected roles, then write and read data. In an isolated environment, stop a primary, observe election and recovery, and verify rejoining. Clients need Cluster routing support; a single-node connection is not complete cluster support.

Asynchronous replication means failover can still lose recent writes. Availability also depends on connectivity among a majority of primaries and slot coverage. Failover does not replace backups. Expansion requires explicit slot migration and load observation.

**References**

- [Redis Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/)
