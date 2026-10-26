---
source_sha256: 8d4bdde5daabc62dada63cfd85a2bc1dd886ac97d3765ea8fa6201931fa4ad1a
title: "Nutz 1.b.53 lang: Strings, Dates, IO and Reflection Utilities"
date: '2016-03-22'
lang: en
translation_key: nutz-lang-overview
permalink: /en/2016/03/22/nutz-lang-overview/
description: "Map Nutz 1.b.53 lang utilities to caller needs, checking defaults, null behavior, path conventions and resource ownership against the underlying JDK APIs."
---

org.nutz.lang wraps common JDK operations in shorter interfaces. To understand a utility, examine both the duplication it removes and any changes to error, null and cleanup semantics. This uses Nutz 1.b.53 as its baseline.
<!--break-->

## Group utilities by responsibility

| Utility | Main focus |
|---|---|
| Strings | String checks, conversion and splitting |
| Nums, Maths | Numeric processing and calculation helpers |
| Times | Date parsing, formatting and ranges |
| Streams | Byte/character streams and closing policies |
| Files | Paths, files and directories |
| Mirror | Types, members, annotations and object creation |
| Lang | General entry points such as contexts |

A convenient name makes boundary checks more important. readAndClose and read differ in ownership. A tilde in a path is not necessarily expanded by the JDK. Framework conventions cannot be inferred as Java standard behavior.

## Begin with the caller's question

For files, start with encoding and exceptions; for dates, timezone and thread safety; for reflection, access and target types. Follow one method to its final JDK call and identify added defaults and tolerance.

Fixed inputs and expected-versus-actual comparisons are more informative than utility-class line counts. Many methods do not guarantee suitability for every project. If standard APIs already meet the requirement, shorter code alone need not justify introducing another semantic layer.

The following articles examine strings, dates, I/O and reflection, connecting these foundations to higher-level modules such as JSON and Mapl.

**References**

- [Nutz 1.b.53 source archive](https://repo.maven.apache.org/maven2/org/nutz/nutz/1.b.53/nutz-1.b.53-sources.jar)
