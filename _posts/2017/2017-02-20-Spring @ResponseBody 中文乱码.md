---
layout: post
category : java
keywords: "spring,springmvc中文乱码"
description: "Spring MVC 返回中文乱码时，需要同时检查 Java 字符串、消息转换器和 HTTP 响应编码。字符串与对象可能由不同转换器处理，某个旧版默认字符集不能代表所有 Spring Boot 项目的最终配置。"
tags : [学习笔记]
lang: zh-CN
translation_key: spring-responsebody-encoding
---

Spring MVC 返回中文乱码时，需要同时检查 Java 字符串、消息转换器和 HTTP 响应编码。字符串与对象可能由不同转换器处理，某个旧版默认字符集不能代表所有 Spring Boot 项目的最终配置。
<!--break-->

{% include JB/setup %}

## 纯文本响应明确声明类型

```java
@GetMapping(value = "/hello", produces = "text/plain;charset=UTF-8")
@ResponseBody
public String hello() {
    return "你好";
}
```

这是 Controller 方法片段，需要对应 Spring MVC 注解。声明 text/plain 表明返回普通文本，不要仅为了指定 UTF-8 就把任意字符串标成 JSON。

## JSON 交给对象转换器

```java
@GetMapping(value = "/message", produces = "application/json")
@ResponseBody
public Map<String, String> message() {
    return Collections.singletonMap("message", "你好");
}
```

片段使用 JDK 的 Map 和 Collections，要求运行环境已配置 JSON 消息转换器。返回对象便于统一处理字段和转义，但仍需确认实际转换器及配置，不能说返回对象就无需任何环境条件。

## 不要用错误解码修补正确字符串

将一个中文字符串转为默认编码字节、再按 ISO-8859-1 构造字符串，会误解字节，还依赖机器默认编码。修复应该发生在真正错用编码的边界。

先确认源文件与 Java 字符串正确，再查看 Content-Type 和响应原始字节，最后确认客户端如何解码。请求参数、数据库连接和页面编码是其他边界，应分别验证。

参考：[Spring MVC 消息转换器](https://docs.spring.io/spring-framework/reference/web/webmvc/message-converters.html)。
