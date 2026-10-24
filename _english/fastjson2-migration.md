---
source_sha256: a0664a33f6e9b125b1b20b994d50bf5ffb9dc423697f267b4e5914bbb63c7425
title: Migrating from Fastjson 1.x to Fastjson2
date: '2022-05-29'
lang: en
translation_key: fastjson2-migration
permalink: /en/2022/05/29/fastjson2-migration/
description: 'When migrating from Fastjson 1.x to Fastjson2, I separated two concerns: standardizing Spring MVC responses on Jackson, and moving internal JSON utility calls to Fastjson2. This allowed the API protocol and utility behavior to be verified i'
---

When migrating from Fastjson 1.x to Fastjson2, I separated two concerns: standardizing Spring MVC responses on Jackson, and moving internal JSON utility calls to Fastjson2. This allowed the API protocol and utility behavior to be verified independently, reducing the scope of each change.
<!--break-->

## Distinguish native APIs from compatibility modules

Fastjson2 native APIs use `com.alibaba.fastjson2`. Check dependency coordinates, imports and feature configuration together; replacing a version number is insufficient. Verify compatibility modules and native modules separately.

Version 2.0.4 was used during this migration. That records the historical environment, rather than recommending a version for later projects. Choose a target version through dependency management and validation.

```java
import com.alibaba.fastjson2.JSON;

String json = JSON.toJSONString(value);
MyBean bean = JSON.parseObject(json, MyBean.class);
```

This shows the calling pattern only. Null output, naming, dates, enums, large integers, repeated references and polymorphism can affect results. Compare the actual target version with existing API behavior.

## Verify Spring MVC output separately

After removing a custom Fastjson message converter, inspect the converters actually registered at runtime, JSON annotations and ObjectMapper configuration. A Jackson dependency alone does not prove every endpoint has switched.

For an older application using `Date`, configuration may include:

```properties
spring.jackson.date-format=yyyy-MM-dd HH:mm:ss
spring.jackson.locale=zh
spring.jackson.time-zone=GMT+8
```

Use lowercase `yyyy`. Uppercase `YYYY` means the week-based year and can differ around New Year. Check `LocalDate`, `LocalDateTime` and other Java time types with JavaTimeModule or field-level formatting; these three properties should not be assumed to cover every type.

## Do not hide entity output problems with global switches

Hibernate proxies, bidirectional associations and lazy loading after session closure can all affect serialization. Prefer explicit response DTOs over exposing a complete entity graph.

Ignoring `hibernateLazyInitializer` and `handler` addresses particular proxy properties, but does not solve association fetching or circular references. Globally disabling `FAIL_ON_EMPTY_BEANS` can turn useful failures into empty objects. Creating an ObjectMapper with `new ObjectMapper()` can also lose Spring Boot's modules and configuration, so it is a poor general repair.

## Confirm the protocol with representative samples

Keep API input and output samples covering null versus missing fields, IDs beyond JavaScript's safe integer range, timezone handling, Chinese text, enums and nested objects. Verify deserialization and invalid inputs as well as serialization.

The goal is a controlled business protocol, rather than two libraries coincidentally producing identical text in every situation. Document and test the differences that the protocol intentionally preserves.

**References**

- [Documentation: github.com](https://github.com/alibaba/fastjson2/wiki/fastjson_1_upgrade_cn)
