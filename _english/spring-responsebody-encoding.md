---
source_sha256: f9faa949219c3a8c6d7fd4a21c79ddd3e5aff9978a3555b9e93243ecdfa28068
title: Fixing Chinese Text Encoding in Spring MVC Responses
date: '2017-02-20'
lang: en
translation_key: spring-responsebody-encoding
permalink: /en/2017/02/20/spring-responsebody-encoding/
description: Garbled Chinese responses in Spring MVC require checking the Java string, message converter and HTTP encoding together. Strings and objects may use different converters. A historical default charset does not describe every Spring Boot appli
---

Garbled Chinese responses in Spring MVC require checking the Java string, message converter and HTTP encoding together. Strings and objects may use different converters. A historical default charset does not describe every Spring Boot application's effective configuration.
<!--break-->

## Declare the type of a plain-text response

```java
@GetMapping(value = "/hello", produces = "text/plain;charset=UTF-8")
@ResponseBody
public String hello() {
    return "你好";
}
```

This Controller method fragment requires the corresponding Spring MVC annotations. text/plain declares ordinary text. Do not label an arbitrary string as JSON merely to specify UTF-8.

## Let an object converter handle JSON

```java
@GetMapping(value = "/message", produces = "application/json")
@ResponseBody
public Map<String, String> message() {
    return Collections.singletonMap("message", "你好");
}
```

The fragment uses JDK Map and Collections and requires a configured JSON message converter. Returning objects centralizes field output and escaping, but the active converter and settings still need verification. It does not remove environment requirements.

## Do not repair a valid string by decoding it incorrectly

Converting Chinese text to bytes in the default charset and reconstructing it as ISO-8859-1 misinterprets bytes and depends on machine defaults. Fix the boundary where the incorrect encoding was actually applied.

First confirm source-file encoding and the Java string. Then inspect Content-Type and raw response bytes, followed by client decoding. Request parameters, database connections and page encoding are separate boundaries to validate independently.

**References**

- [Spring MVC message converters](https://docs.spring.io/spring-framework/reference/web/webmvc/message-converters.html)
