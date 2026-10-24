---
source_sha256: 56b2b59405bcd2b24c41488df68f1a41cdb650acd3c62f747017ea061f5fd16d
title: 'Reading Nutz JSON: Parsing and Rendering'
date: '2016-01-01'
lang: en
translation_key: nutz-json-conversion
permalink: /en/2016/01/01/nutz-json-conversion/
description: Nutz JSON handles both JSON text and Java types and fields. Separating parsing from rendering makes each layer's responsibility easier to understand. This discussion uses version 1.b.53 as its source baseline.
---

Nutz JSON handles both JSON text and Java types and fields. Separating parsing from rendering makes each layer's responsibility easier to understand. This discussion uses version 1.b.53 as its source baseline.
<!--break-->

## Follow entry-point overloads to their responsibilities

```java
Map data = Json.fromJson(Map.class, "{\"name\": \"Alice\", \"age\": 18}");
String text = Json.toJson(data, JsonFormat.compact());
```

The fragment uses org.nutz.json.Json, JsonFormat and java.util.Map. It follows text into an in-memory object and back into text. fromJson overloads accept Reader, CharSequence and target Type information. The input source and the desired result shape are separate dimensions.

`fromJsonAsArray` returns an array; `fromJsonAsList` returns a list. Processing JSON arrays does not make these return types interchangeable. For generic collections, inspect how element type information is passed rather than examining only the outer Class.

## Rendering dispatches by type

JsonRenderImpl holds a Writer and JsonFormat. render selects different paths for null, numbers, booleans, characters, dates, maps, collections, arrays and ordinary objects.

A number and string with the same displayed content still have different JSON types. Strings need quote, backslash and control-character escaping. Date output depends on formatting policy. An object's toString cannot correctly generate every JSON representation.

## Inspect field metadata and references

Ordinary-object access goes through descriptions such as JsonEntity. Field naming, ignoring and custom output affect results together. Containers and objects can share references or form cycles. Check this version's memo and recursion branches to establish output behavior.

Beyond the minimal case, test nested collections, nulls, special characters and repeated references. A text round trip does not guarantee preservation of Java types. Integer width, dates and custom objects still depend on target types and conversion rules.

**References**

- [Nutz 1.b.53 source archive](https://repo.maven.apache.org/maven2/org/nutz/nutz/1.b.53/nutz-1.b.53-sources.jar)
