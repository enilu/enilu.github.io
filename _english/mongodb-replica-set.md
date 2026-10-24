---
source_sha256: 2ec2e5d184c666c1e8d0b698f6f6d62cdef7c501d2b46ffb63cfb463473c2e4d
title: Setting Up and Understanding a MongoDB Replica Set
date: '2016-06-15'
lang: en
translation_key: mongodb-replica-set
permalink: /en/2016/06/15/mongodb-replica-set/
description: A MongoDB replica set stores the same dataset on multiple members and elects a new primary when the existing one becomes unavailable. It primarily provides redundancy and failover. Sharding distributes data across shards; the two can be com
---

A MongoDB replica set stores the same dataset on multiple members and elects a new primary when the existing one becomes unavailable. It primarily provides redundancy and failover. Sharding distributes data across shards; the two can be combined but serve different purposes.
<!--break-->

## Understand roles and majority votes

The Primary accepts ordinary writes. Secondaries copy and apply changes, while eligible members participate in elections. An Arbiter votes without storing business data, so it is not a data copy. It participates in the election protocol rather than independently choosing the primary.

A primary, secondary and arbiter make a learning topology with only two data copies. Evaluate redundancy, write concern and failure domains before choosing an arbiter. Three machines do not automatically provide three recoverable copies.

## Configure and initialize members

This illustrates MongoDB 3.2 YAML structure. Supply paths appropriate to the host:

```yaml
storage:
  dbPath: /path/to/data
systemLog:
  destination: file
  path: /path/to/mongod.log
  logAppend: true
net:
  bindIp: 127.0.0.1
  port: 27017
replication:
  replSetName: demo-rs
```

Loopback binding is for local study. Across hosts, members need mutually reachable addresses and each process needs separate directories. With member authentication, keyFile contents must match and paths and permissions must be correct. Bootstrap accounts using the relevant version's localhost exception and authentication procedure, rather than experimenting with misspelled auth options.

In the matching mongo shell, run `rs.initiate` on one member with the planned member configuration. Inspect roles and health with `rs.status()`. Application connection strings should include the replica-set name and discoverable members, rather than permanently binding to whichever member is primary today.

## Read preference does not guarantee fresh data

Secondaries actively replicate and can serve queries when read preference permits. They may lag, so evaluate read concern, write concern, sessions and application consistency requirements together. Allowing secondary reads does not automatically balance all queries evenly.

In isolation, test stopping a primary, election, client reconnection and catch-up, including the chosen write concern's failure behavior. Stop processes normally through the service manager or an authorized shutdown command; forced termination should not be routine maintenance.

**References**

- [Replica sets](https://www.mongodb.com/docs/manual/replication/)
- [Arbiters](https://www.mongodb.com/docs/manual/core/replica-set-arbiter/)
