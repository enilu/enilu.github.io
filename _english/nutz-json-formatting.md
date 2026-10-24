---
source_sha256: 91e2c38f8c48e18b098e016be526b8c7873affe9106cb19b4cc0787ad5723ee5
title: 'Reading Nutz JSON: Annotations and Formatting'
date: '2016-01-03'
lang: en
translation_key: nutz-json-formatting
permalink: /en/2016/01/03/nutz-json-formatting/
description: Null handling, field names and date formats become part of an API contract. Nutz expresses these policies through annotations and JsonFormat. Follow configuration through to the renderer that actually uses it. This article is based on 1.b.5
---

Null handling, field names and date formats become part of an API contract. Nutz expresses these policies through annotations and JsonFormat. Follow configuration through to the renderer that actually uses it. This article is based on 1.b.53.
<!--break-->

## Annotations describe object output

JsonField specifies policies such as names, ignoring, string conversion and date formats. JsonIgnore expresses omission, while ToJson provides a custom output entry point. Since custom output changes an object's public representation, check method signatures, return forms and failure handling together.

Annotation definitions are not the complete implementation. They first become field or entity descriptions and are then interpreted during conversion and rendering. Follow an annotated field and compare the Java property with its actual JSON key rather than stopping at the annotation declaration.

## Presets can change which fields appear

In this version, compact is compact output omitting nulls, while tidy is compact output retaining them. nice and full offer different readable combinations. forLook also disables quotes around field names. It is suited to inspection and should not automatically be used for strict JSON APIs.

```java
Map<String, Object> data = new LinkedHashMap<>();
data.put("name", "Alice");
data.put("remark", null);
System.out.println(Json.toJson(data, JsonFormat.compact()));
System.out.println(Json.toJson(data, JsonFormat.tidy()));
```

The fragment needs JDK Map and LinkedHashMap plus Nutz Json and JsonFormat. Observe whether remark exists, rather than only whitespace. Clients may distinguish a missing field from explicit null; shorter logs do not justify silently changing an API format.

## Exceptions aid diagnosis, not validation

JsonException position information can help locate parse failures, but logs should not print unbounded requests. Dates, enums and numbers still require business validation after parsing. Constructing an object does not prove that it satisfies business rules.

**References**

- [Nutz 1.b.53 source archive](https://repo.maven.apache.org/maven2/org/nutz/nutz/1.b.53/nutz-1.b.53-sources.jar)
