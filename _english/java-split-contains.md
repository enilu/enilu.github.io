---
source_sha256: 0702c94d87f4c3e33254dba1118f307057288a0238c519c836ee209986c2dce2
title: 'Java String split and contains: Regex or Literal Text?'
date: '2016-05-20'
lang: en
translation_key: java-split-contains
permalink: /en/2016/05/20/java-split-contains/
description: Some Java string APIs accept literal text, while others accept regular expressions. Similar names can conceal different argument semantics. A dot used as a split delimiter is a particularly common source of surprises.
---

Some Java string APIs accept literal text, while others accept regular expressions. Similar names can conceal different argument semantics. A dot used as a split delimiter is a particularly common source of surprises.
<!--break-->

## contains searches text; split uses a regex

```java
String value = "aaa.add.d";
System.out.println(value.contains("."));       // true
System.out.println(value.split(".").length);  // 0
System.out.println(value.split("\\.").length); // 3
```

In Java source, the final delimiter must be `"\\."`: Java string parsing produces a backslash and dot, then the regex parser interprets them as a literal dot. The regex `.` matches any character. Since split discards trailing empty strings by default, the second result has length zero.

Use Pattern.quote to avoid manually escaping a literal delimiter:

```java
String[] parts = value.split(java.util.regex.Pattern.quote("."));
```

## Decide whether empty fields matter

```java
System.out.println("a,b,".split(",").length);     // 2
System.out.println("a,b,".split(",", -1).length); // 3
```

A negative limit preserves trailing empty fields, useful in simple delimited text where position matters. Real CSV includes quoting, escaping and line breaks inside fields, so one split cannot parse it correctly.

## Compare similar methods

| Method | Argument semantics |
|---|---|
| `contains`, `startsWith`, `endsWith` | Literal text |
| `replace` | A character or literal character sequence |
| `matches`, `split` | Regular expressions; matches requires the entire string to match |
| `replaceAll`, `replaceFirst` | Regex search argument; replacement has special syntax too |

Dollar signs and backslashes in replacements can also be interpreted specially. If externally supplied replacement content must remain literal, use `Matcher.quoteReplacement`. Decide whether regex behavior is needed before choosing the API; that is usually clearer than repeatedly adding backslashes.

**References**

- [Java String](https://docs.oracle.com/javase/8/docs/api/java/lang/String.html)
- [Pattern](https://docs.oracle.com/javase/8/docs/api/java/util/regex/Pattern.html)
