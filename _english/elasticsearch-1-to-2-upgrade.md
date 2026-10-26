---
source_sha256: c0d01fc9ae17fe54ca36b1cc40fe1751e84a5ced37c5726b195fa9e82e425952
title: "Elasticsearch 1.4.4 to 2.3.4: JDK, Configuration and Compatibility"
date: '2016-07-18'
lang: en
translation_key: elasticsearch-1-to-2-upgrade
permalink: /en/2016/07/18/elasticsearch-1-to-2-upgrade/
description: "Review an Elasticsearch 1.4.4-to-2.3.4 upgrade across Java, accounts, discovery, clients and plugins, with index compatibility and rollback validation."
---

Upgrading Elasticsearch from 1.4.4 to 2.3.4 affected more than the server: the JDK, service account, discovery configuration, plugins and Java client all changed. These layers need verification as one compatibility chain.
<!--break-->

## Isolate the historical version combination

I moved from OpenJDK 7 to JDK 8 and configured Elasticsearch's Java environment separately to avoid affecting other services. Set runtime options through supported configuration rather than modifying startup scripts that upgrades may replace.

Run with a dedicated account and check permissions on data, log and configuration directories. Bypassing restrictions on running as root is not a substitute for selecting the correct service user.

## Match configuration syntax to the version

This form belongs to the 2.3.4 environment, not later versions with different discovery mechanisms:

```yaml
cluster.name: demo-search
node.name: node-1
network.host: 192.0.2.10
discovery.zen.ping.unicast.hosts: ["192.0.2.11", "192.0.2.12"]
```

Replace the example addresses. Top-level keys do not require uniform leading spaces. Keep a space after a colon and indent nested structures according to YAML rules. Match cluster names, distinguish node names and verify communication between members.

## Verify clients and plugins together

I encountered transport-protocol errors and had to inspect Java clients still connecting to the old environment. Such an error has several possible causes. Check ports, server and client versions, and dependencies actually loaded before concluding that versions are mismatched.

Compile changed APIs such as ImmutableSettings and query builders against the target and run query regressions. Delete-by-query being a plugin in 2.x does not mean every other deletion mechanism disappeared. Confirm deletion scope before executing dangerous operations; repeated plugin installation attempts do not solve incompatibility.

## Decide migration and rollback beforehand

Validate index compatibility, snapshot recovery and required plugins before upgrading. Use an upgrade route supported by the target version instead of arbitrarily mixing old and new nodes. Rollback does not mean old binaries can read an upgraded data directory.

Test indexing, queries, aggregations, sorting and deletion with representative data, comparing time, errors and results. The upgrade is complete only when both application behavior and operational workflows pass.

**References**

- [Elasticsearch 2.3 documentation](https://www.elastic.co/guide/en/elasticsearch/reference/2.3/index.html)
