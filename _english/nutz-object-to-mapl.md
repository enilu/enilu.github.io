---
source_sha256: 4cee7a8534daf0930dc09d4f2be634f93cba0000ab7ba6516ee6114e1a33c574
title: "Nutz 1.b.53 Mapl: Object Conversion, memo and Boundaries"
date: '2016-01-05'
lang: en
translation_key: nutz-object-to-mapl
permalink: /en/2016/01/05/nutz-object-to-mapl/
description: "Follow ObjCompileImpl in Nutz 1.b.53 through leaves, containers and POJOs, examining memo comparisons, asymmetric map conversion and stringified keys."
---

Mapl uses Map and List as structural containers for reading, converting and modifying objects by path. It does not require every leaf to become another Map or List: values such as numbers and strings can remain leaves. This follows ObjCompileImpl in Nutz 1.b.53.
<!--break-->

## Start with type dispatch

parse first handles null, enums, numbers, booleans, characters and dates, followed by collections, arrays, maps and ordinary objects. Arrays and collections become Lists; ordinary objects become Maps assembled through field descriptions.

```text
Object -> Type dispatch -> Preserve leaf values
                        -> Create container -> Convert items
                        -> Describe POJO fields -> Process field values
```

Json in a method name does not mean a JSON string has already been created. The result is still an in-memory Java structure until a serializer turns it into text.

## memo tracks previously encountered objects

Before descending into a container, the implementation registers the target container in memo and then fills it. Encountering a matching key again can reuse the result instead of creating containers indefinitely. This uses Map key comparison; it should not be described as strict object-identity caching without inspecting that behavior.

The branches are also not completely symmetrical. This version's map2Json adds entry values to Pair, and writeItem puts them directly into the target Map. Collection elements, by contrast, each go through parse. The phrase converting to Mapl does not establish uniform deep normalization for every input.

## Convenient structures still have conversion costs

Map keys are stringified, so distinct keys with identical text may overwrite each other. POJO field access can fail, and references inside containers may remain shared. Test nested maps, collections, nulls and shared references before using the result as an intermediate API representation.

**References**

- [Nutz 1.b.53 ObjCompileImpl source](https://repo.maven.apache.org/maven2/org/nutz/nutz/1.b.53/nutz-1.b.53-sources.jar)
