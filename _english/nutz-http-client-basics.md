---
source_sha256: 8dcd0d5b33ca991ff1342e73b0102c6a4bdf7797b76517becf742d3fb58ecfc7
title: 'Reading the Nutz HTTP Client: Following a GET Request'
date: '2016-02-02'
lang: en
translation_key: nutz-http-client-basics
permalink: /en/2016/02/02/nutz-http-client-basics/
description: Nutz HTTP wraps request construction, connections and responses in a small set of classes. Following a GET shows how convenience methods reach the JDK's networking APIs. This article uses the 1.b.53 implementation.
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
