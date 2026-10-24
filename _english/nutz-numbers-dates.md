---
source_sha256: c47f2bcbcb356b4b42c71ca6948934b9038926bfab84c7d53df97b39d031f64e
title: 'Reading Nutz Nums and Times: Numeric and Date Boundaries'
date: '2016-06-04'
lang: en
translation_key: nutz-numbers-dates
permalink: /en/2016/06/04/nutz-numbers-dates/
description: Numeric and date utilities may require only a few lines at call sites, yet boundary errors flow directly into reports and business decisions. Reading Nutz 1.b.53 Nums and Times, I focus on range, time reference and concurrency rather than j
---

Numeric and date utilities may require only a few lines at call sites, yet boundary errors flow directly into reports and business decisions. Reading Nutz 1.b.53 Nums and Times, I focus on range, time reference and concurrency rather than judging importance by class length.
<!--break-->

## State the calendar behind leap-year rules

Times.leapYear uses the familiar Gregorian rule: divisible by four, with century years also requiring divisibility by 400. Test 1900, 2000 and an ordinary leap year rather than only one multiple of four.

```java
System.out.println(Times.leapYear(1900)); // false
System.out.println(Times.leapYear(2000)); // true
```

The fragment imports org.nutz.lang.Times. Historical dates and other calendars require separate business definitions. One Gregorian rule should not be generalized to every time representation.

## Track formatter ownership

In this version, format(DateFormat, Date) and parse(DateFormat, String) clone the supplied formatter before use. Pattern-string overloads create new SimpleDateFormat instances. This matters more than simply observing that SimpleDateFormat is used internally: sharing mutable state differs from using an independent instance for each call.

Callers should still avoid changing the original formatter while it is being cloned. yyyy and YYYY have different meanings. Timezone and Locale should not depend on convenient deployment-machine defaults.

## Millisecond durations are not calendar arithmetic

A fixed number of milliseconds per day represents some durations, but not the next calendar day in every timezone. Daylight saving, month lengths and week-start conventions affect ranges. Inclusive versus half-open endpoints must match query conditions.

For Nums parsing, concatenation and range operations, check overflow, signs and input format. Use different suitable types for money, counts and IDs rather than treating generic numeric conversion as business precision handling.

**References**

- [Nutz 1.b.53 Times source](https://repo.maven.apache.org/maven2/org/nutz/nutz/1.b.53/nutz-1.b.53-sources.jar)
