---
source_sha256: 2e18b2559bc4e40cfdbb909034409971293b766983efefd10a54c5b90f464fc0
title: 'Lucene in Action: Notes on Indexing and Search'
date: '2014-07-28'
lang: en
translation_key: lucene-reading-notes
permalink: /en/2014/07/28/lucene-reading-notes/
description: The most useful distinction I found while reading Lucene in Action was between building an index and searching it. Lucene is an embedded retrieval library, not a complete search server with its own HTTP interface.
---

The most useful distinction I found while reading Lucene in Action was between building an index and searching it. Lucene is an embedded retrieval library, not a complete search server with its own HTTP interface.
<!--break-->

## Documents and fields do not directly replace database rows and columns

A Document represents a searchable record, with Fields for its individual properties. A file might have path, title, body and modification time fields. Some identify it exactly, some support tokenized search, and others are only needed for display.

| Requirement | Capability to consider |
|---|---|
| Replace an existing file by path | Stable, untokenized identifier |
| Search body keywords | Language-appropriate analysis and indexing |
| Return filename and excerpt | Stored fields or retrieval from the source |
| Sort by time | Numeric and sorting structures supported by the version |

Storage determines whether original field content can be retrieved; indexing determines searchability. Sorting may require separate structures such as DocValues. An unstored field can still be searchable.

## Analysis determines which terms match

An Analyzer produces a token stream, potentially splitting words, lowercasing and removing stop words. Index and query analysis must be compatible, or the same text may not match at all.

Encoding, field names and business meanings must also agree. A date can be represented as a timestamp, but range search, sorting and display fields should use the selected Lucene major version's API. Do not mix the book's NumericField examples with modern Point APIs.

## Separate writing, visibility and persistence

IndexWriter handles writes and updates, while Reader/Searcher reads an index view. Completing a write, committing it to disk and making it visible to an existing searcher are different events. Use near-real-time reading or reader reopening as appropriate.

Indexes comprise multiple segments, and merges consume I/O and space. Forcing a single segment after every write is not a routine optimization. Measure query and write workloads before deciding whether offline consolidation is needed.

Build a minimal application to verify stable-ID updates, deletion, analysis and searcher refresh. This reveals more than memorizing class names. [Building a Small Desktop Search Tool with Lucene](/en/2014/07/31/lucene-desktop-search/) connects these mechanisms in a small example.

**References**

- [Apache Lucene](https://lucene.apache.org/core/)
