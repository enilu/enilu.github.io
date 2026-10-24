---
source_sha256: b80d01ac65af12d27eab0ffd819081423ceeae1ca9432dea8e38820a458e4328
title: 'Reading Nutz Mapl: Path Operations and Merge Semantics'
date: '2016-01-13'
lang: en
translation_key: nutz-mapl-paths-merge
permalink: /en/2016/01/13/nutz-mapl-paths-merge/
description: 'Updating a nested field often means traversing Maps and Lists manually. Nutz MaplRebuild encapsulates path handling, while MaplMerge combines structures. Their related appearance should not obscure their separate semantics. This discussion '
---

Updating a nested field often means traversing Maps and Lists manually. Nutz MaplRebuild encapsulates path handling, while MaplMerge combines structures. Their related appearance should not obscure their separate semantics. This discussion uses 1.b.53.
<!--break-->

## Read and modify through paths

Mapl provides entry points such as cell, put, update and del, delegating to path-processing implementations. A path such as `user[0].name` must distinguish Map keys from List indices and establish what happens when an intermediate node is missing.

Out-of-range indices, incompatible values and misspelled paths are not equivalent to an empty field. If a request supplies a path, restrict writable fields so it cannot bypass normal business update rules.

## Merging is not one universal overwrite rule

In 1.b.53, MaplMerge dispatches according to its first argument: Maps go to mergeMap, Lists to mergeList, and ordinary values to mergeObj. List deduplication uses contains and therefore equals. Ordinary values can also become a deduplicated list; inputs need not all be Maps or Lists.

For a shared Map key, later ordinary values generally overwrite earlier ones. A later Map/List with an existing non-null value triggers further merging. This neither turns every same-name field into a list nor safely recurses through arbitrary heterogeneous values.

```text
{a:1} and {a:2} -> a ends up as 2
[1,2] and [2,3] -> merged as [1,2,3]
```

These examples illustrate semantics, not strict JSON text. Mixed container types can reach incompatible casts. Validate input structures first.

## Define business conflict policies explicitly

Configuration merging, company-data aggregation and user patches differ in their treatment of nulls, empty lists and conflicting fields. Test conflict examples before selecting a tool. Establish whether it modifies inputs or retains nested references before using it directly in business logic.

**References**

- [Nutz 1.b.53 MaplMerge source](https://repo.maven.apache.org/maven2/org/nutz/nutz/1.b.53/nutz-1.b.53-sources.jar)
