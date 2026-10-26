---
source_sha256: 52a814decac9e6944a8ca2a7af1e3db2eca87677f8016ef2e82f33352b4e2c22
title: "Nutz 1.b.53 HTTP: GET Calls, Responses and Stream Ownership"
date: '2016-02-02'
lang: en
translation_key: nutz-http-client-basics
permalink: /en/2016/02/02/nutz-http-client-basics/
description: "Trace Nutz 1.b.53 HTTP calls through Request and Sender, inspect statuses and compressed or error responses, and test stream ownership locally."
---

Nutz HTTP wraps request construction, connections and responses in a small set of classes. Following a GET shows how convenience methods reach the JDK's networking APIs. This article uses the 1.b.53 implementation.
<!--break-->

## Trace one call chain

```text
Http.get -> Request -> Sender.create -> GetSender.send
         -> HttpURLConnection -> Response
```

Http is the entry point. Request holds method, URL and parameters. Sender handles common connection and header work, while GetSender performs the corresponding send flow. In this version, Sender.create routes both GET and DELETE to GetSender. Its name does not establish that it supports only GET.

## Response contains more than a body

```java
Response response = Http.get("http://127.0.0.1:18080/hello");
System.out.println(response.getStatus());
System.out.println(response.getContent());
```

The fragment imports org.nutz.http.Http and Response and expects a local test service at the specified port. Check status and content type before interpreting the body. Connectivity, HTTP success and business success are distinct outcomes.

Sender also handles gzip/deflate decompression, error streams and interceptors. Looking only at a successful JSON response misses non-2xx, empty-body and compressed-response behavior.

## Verify ownership with a local service

Content-reading, stream-returning and direct-to-file methods may assign closing responsibility differently. If the caller holds getStream directly, establish who consumes and closes it. Do not leave it open until garbage collection.

Create fixed local responses for plain text, errors and delayed content, then observe parameters, status and exceptions. This makes a better source-reading fixture than a public homepage that can change at any time.

**References**

- [Nutz 1.b.53 HTTP source](https://repo.maven.apache.org/maven2/org/nutz/nutz/1.b.53/nutz-1.b.53-sources.jar)
