---
source_sha256: fe77586449277407a5d3b07a0f35f6c71fbc463c60b09f4d106a7a79c6546001
title: 'Reading Nutz Mirror: Reflection and Object Construction'
date: '2016-07-02'
lang: en
translation_key: nutz-reflection
permalink: /en/2016/07/02/nutz-reflection/
description: Nutz Mirror wraps common reflection work involving types, fields, methods and object creation. It helps explain how frameworks map external data into objects, but does not bypass every access restriction. This discussion is based on 1.b.53.
---

Nutz Mirror wraps common reflection work involving types, fields, methods and object creation. It helps explain how frameworks map external data into objects, but does not bypass every access restriction. This discussion is based on 1.b.53.
<!--break-->

## Reading a field differs from calling a getter

Invoking a getter through Method can trigger business computation, lazy loading or other side effects. Reading through Field accesses a particular field while requiring attention to declaring class, inheritance and permissions. Both obtain a property without guaranteeing identical values or behavior.

Mirror centralizes repeated lookups and type checks. Follow the wrapper to Method.invoke, Field.get or another final entry point to identify its defaults.

## Follow annotation inheritance rules

Mirror.getAnnotation in 1.b.53 searches parent classes for a requested annotation. Not every reflection API performs that recursion. Interfaces, methods, fields and classes have different annotation rules, and runtime reading requires appropriate Retention.

Finding an annotation on a class does not give all members the same semantics. Inspect the framework's lookup and override order to understand parent/child configuration merging.

## Distinguish object construction paths

ArrayBorning creates an array of the specified type and length through reflection. Reference elements initially contain null; it does not instantiate an object per position. Primitive arrays contain their corresponding default values.

ConstructorBorning holds a Constructor and uses Constructor.newInstance(args), rather than Class.newInstance. Exceptions thrown inside a constructor arrive through InvocationTargetException; wrappers should preserve the underlying cause.

This version attempts to make members accessible. Later JDK module encapsulation may restrict that access. Investigate the target constructor, arguments and runtime permissions rather than assuming setAccessible guarantees compatibility.

Reflection enables runtime inspection and creation while adding conversion, performance and maintenance costs. Understand the call boundaries before considering caching and optimization.

**References**

- [Nutz 1.b.53 Mirror/Borning source](https://repo.maven.apache.org/maven2/org/nutz/nutz/1.b.53/nutz-1.b.53-sources.jar)
