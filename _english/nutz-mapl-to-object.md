---
source_sha256: 4697e16671ac6f16a09083c998e2d154a0263e60c36aa89363c5a638999d3401
title: 'Reading Nutz Mapl: Converting Structures Back to Objects'
date: '2016-01-11'
lang: en
translation_key: nutz-mapl-to-object
permalink: /en/2016/01/11/nutz-mapl-to-object/
description: Restoring Java objects from Map/List structures requires both source values and target types. ObjConvertImpl in Nutz 1.b.53 separates recursive container injection from leaf conversion. These two layers provide a clearer reading path than f
---

Restoring Java objects from Map/List structures requires both source values and target types. ObjConvertImpl in Nutz 1.b.53 separates recursive container injection from leaf conversion. These two layers provide a clearer reading path than following every conditional individually.
<!--break-->

## Two type entry points

Mapl.maplistToT accepts Class; maplistToObj accepts Type, which can retain additional generic information. List.class alone does not establish that every element is a business entity.

For a non-Map/List input, convert attempts conversion through Castors. Containers go to inject, which proceeds according to whether the target is a collection, map, array or POJO.

## The target structure drives recursion

```text
Source Map/List + Target Type
    -> Collection: determine element type and convert each item
    -> Map: handle key and value types
    -> Array: determine component type, allocate and fill
    -> POJO: create instance, read field types and inject
```

Castors handles leaf conversions such as strings and numbers. Instance creation and field assignment also depend on reflection. When source and target structures disagree, a converter cannot decide the intended business meaning automatically.

## Inspect failures after understanding success

Missing fields, nulls, unparseable numbers and overflow each need an explicit policy. Structural conversion is not request validation. For external inputs, allowlist writable fields instead of injecting an arbitrary Map into an entity containing authorization or state properties.

This version's source also warns about circular-reference handling. Forward conversion's memo does not establish that reverse conversion supports arbitrary cyclic graphs. Test shallow, nested, generic and invalid inputs separately to determine suitability for your data.

**References**

- [Nutz 1.b.53 ObjConvertImpl source](https://repo.maven.apache.org/maven2/org/nutz/nutz/1.b.53/nutz-1.b.53-sources.jar)
