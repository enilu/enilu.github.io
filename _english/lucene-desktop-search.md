---
source_sha256: db704a53a9c1d3f40e802ea425c35e764f76da00fc441385a7506ab0119cedc3
title: Building a Small Desktop Search Tool with Lucene
date: '2014-07-31'
lang: en
translation_key: lucene-desktop-search
permalink: /en/2014/07/31/lucene-desktop-search/
description: 'A desktop search tool has a simple brief: read text files from a directory, index them, and return filenames and paths for keywords. The important details are repeated indexing, changed files, encoding and search-resource lifecycles.'
---

A desktop search tool has a simple brief: read text files from a directory, index them, and return filenames and paths for keywords. The important details are repeated indexing, changed files, encoding and search-resource lifecycles.
<!--break-->

The [project source](https://github.com/enilu/desksearch) uses early Lucene APIs. These fragments follow its Lucene 3.x approach and cannot be mixed directly with classes from later major releases.

## Use paths rather than timestamps as identifiers

A current-millisecond file ID can collide when several files are processed within one millisecond. It also cannot identify the same file during the next scan. Use a normalized path or explicit business file ID so rescanning updates the same index record.

```java
String path = file.getCanonicalPath();
Document doc = new Document();
doc.add(new Field("filepath", path, Field.Store.YES, Field.Index.NOT_ANALYZED));
doc.add(new Field("filename", file.getName(), Field.Store.YES, Field.Index.ANALYZED));
doc.add(new NumericField("inputdate", Field.Store.YES, true)
        .setLongValue(file.lastModified()));
// Read and add the content field before this step.
indexWriter.updateDocument(new Term("filepath", path), doc);
```

This indexing fragment assumes an existing IndexWriter and matching Lucene imports. Close content input streams with try-with-resources or finally, and limit file sizes. Directory listing can fail and symbolic links can create cycles; listFiles is not guaranteed to return a usable list.

## Align analysis and searching

```java
QueryParser parser = new QueryParser(Version.LUCENE_30, "content",
        new StandardAnalyzer(Version.LUCENE_30));
Query query = parser.parse(keyword);
Sort sort = new Sort(new SortField("inputdate", SortField.LONG, true));
TopDocs hits = searcher.search(query, null, 50, sort);
```

Use an existing searcher and analysis compatible with indexing. Sort field names must match indexed fields. When only 50 results are needed, request 50 rather than requesting Integer.MAX_VALUE and truncating afterward.

QueryParser accepts a query language. Colons, parentheses and other user input can have special meanings. If the feature accepts only ordinary keywords, escape input or construct Query objects according to that design instead of exposing all syntax accidentally.

## Manage file changes and search results together

Searchers and readers can be reused, but refresh and closing need explicit ownership. A writer commit may not make changes immediately visible to an existing searcher. Update the index when files change and remove records when files disappear.

Record oversized files, decoding errors and inaccessible directories separately so one failure does not abort the whole scan. Handling one file correctly through creation, search, modification and deletion turns the tool into more than a one-time full-text scan.

**References**

- [Lucene 3.6 API](https://lucene.apache.org/core/3_6_2/api/all/overview-summary.html)
