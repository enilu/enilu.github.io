---
layout: post
category : 学习笔记 
keywords: "nutz,源码学习"
description: "Nutz HTTP 工具把请求构造、连接和响应封装在一组小类里。以一次 GET 为入口，可以看到方便方法怎样落到 JDK 的网络能力。本文以 1.b.53 的实现为基线。"
tags : [nutz,源码学习]
lang: zh-CN
translation_key: nutz-http-client-basics
---

Nutz HTTP 工具把请求构造、连接和响应封装在一组小类里。以一次 GET 为入口，可以看到方便方法怎样落到 JDK 的网络能力。本文以 1.b.53 的实现为基线。
<!--break-->

{% include JB/setup %}

## 先追踪一条调用链

```text
Http.get -> Request -> Sender.create -> GetSender.send
         -> HttpURLConnection -> Response
```

Http 是调用入口，Request 保存方法、URL 与参数，Sender 处理连接和请求头等公共步骤，GetSender 完成对应发送流程。这个版本的 Sender.create 将 GET 和 DELETE 分配给 GetSender，不能仅凭子类名认定它只会处理 GET。

## Response 不只是正文

```java
Response response = Http.get("http://127.0.0.1:18080/hello");
System.out.println(response.getStatus());
System.out.println(response.getContent());
```

片段导入 org.nutz.http.Http 和 Response，并要求本机对应端口上有测试服务。需要先判断状态码与响应类型，再解释正文；连通、HTTP 成功和业务成功是三层不同结果。

Sender 的响应处理还涉及 gzip/deflate 解压、错误流与拦截器。只看正常返回的 JSON，很容易忽略非 2xx、空正文和压缩响应的行为。

## 用本地服务验证资源生命周期

读取内容、返回流及直接写入文件的接口，可能有不同的关闭责任。调用方如果直接持有 getStream，必须明确谁消费并关闭；不能让流一直悬挂到回收时才处理。

准备本地固定响应，分别返回普通文本、错误状态和延迟内容，再观察请求参数、状态与异常。这比调用一个随时变化的公网首页更适合作为源码阅读用例。

参考：[Nutz 1.b.53 HTTP 源码](https://repo.maven.apache.org/maven2/org/nutz/nutz/1.b.53/nutz-1.b.53-sources.jar)。
