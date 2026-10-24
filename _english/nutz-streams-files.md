---
source_sha256: 468af22b77419e9b6a1cfdba523ecd3e13c66acafbc694d4a73da73ead251079
title: 'Reading Nutz Streams and Files: Ownership and Paths'
date: '2016-06-18'
lang: en
translation_key: nutz-streams-files
permalink: /en/2016/06/18/nutz-streams-files/
description: Streams wraps stream reading and writing, while Files handles paths and filesystem operations. Combining them produces short calls, but ownership and path resolution remain explicit concerns. This article follows Nutz 1.b.53.
---

Streams wraps stream reading and writing, while Files handles paths and filesystem operations. Combining them produces short calls, but ownership and path resolution remain explicit concerns. This article follows Nutz 1.b.53.
<!--break-->

## Method names carry ownership conventions

Streams.write and writeAndClose give callers different responsibilities. Writing does not imply closing or completing persistence. Byte copying also differs from character encoding through Reader/Writer.

```java
try (InputStream input = new FileInputStream(source);
     OutputStream output = new FileOutputStream(target)) {
    Streams.write(output, input);
}
```

The fragment uses java.io and org.nutz.lang.Streams. source and target must be distinct paths, and existing target contents are overwritten; confirm that beforehand. Here try-with-resources owns and closes both streams, rather than assigning the same responsibility to the inner method.

For framework-managed resources such as Servlet response streams, establish the outer protocol first. An indiscriminate close can end the entire response.

## Paths involve more than absolute and relative forms

Files and Disks handle conventions such as user, application and classpath locations. Tilde expansion belongs to the utility, not new File syntax. Different runtime users also have different home directories.

Classpath resources may reside inside jars, so a resource URL is not necessarily a disk file. Prefer a stream when reading content instead of always decoding the URL into a local path. URL encoding differs from form encoding; URLDecoder is not a universal path decoder.

## Small helpers still need boundary cases

Extensions are naming conventions. Dotfiles, missing extensions, dots in directory names and multiple suffixes differ. Finding the last dot may be more direct than split, but correctness follows semantics and performance follows measurement.

Failed copying can leave a partial target. Missing directories and insufficient permissions need distinct handling. For external paths, verify that the resolved target remains inside the permitted directory. Convenience utilities are not access controls.

**References**

- [Nutz 1.b.53 Streams/Files source](https://repo.maven.apache.org/maven2/org/nutz/nutz/1.b.53/nutz-1.b.53-sources.jar)
