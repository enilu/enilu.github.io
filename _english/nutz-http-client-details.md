---
source_sha256: cddc5505a7b983eab99c56094a868d224d68bed5e242f07265973d071000fcf1
title: 'Reading the Nutz HTTP Client: Bodies, Timeouts and Cookies'
date: '2016-03-12'
lang: en
translation_key: nutz-http-client-details
permalink: /en/2016/03/12/nutz-http-client-details/
description: After tracing GET, POST bodies, file uploads and cookies reveal how a lightweight HTTP tool handles state and resources. This continues with Nutz 1.b.53. Its timeout constants should not be generalized to every release.
---

After tracing GET, POST bodies, file uploads and cookies reveal how a lightweight HTTP tool handles state and resources. This continues with Nutz 1.b.53. Its timeout constants should not be generalized to every release.
<!--break-->

## Body types affect sending

Sender.create routes certain methods to PostSender, while file forms have FilePostSender. Form fields, raw bytes, streams and multipart are different representations. The parameter object's type determines how the body is written.

Uploading requires multipart boundaries, field headers, encoding and correct closing as well as copying file bytes. Whole-body buffering and whether Content-Length is known affect memory and transmission. The send entry point alone does not establish these behaviors.

## Separate connect and read timeouts

This version's Sender defaults to a 30-second connect timeout and a ten-minute read timeout, set through HttpURLConnection. A read timeout generally limits a wait for data, rather than establishing an absolute deadline for the business operation.

Follow convenience-method parameters to the fields they actually configure. One timeout argument should not be assumed to cover DNS, connection, reading and retries together. If a total deadline is required, design it separately and verify that cancellation releases resources.

## Handle cookies according to the protocol

Requests use Cookie; responses use Set-Cookie. They are different headers. Name comparison, repeated response headers, Domain, Path and expiration affect correct session reuse.

In 1.b.53, getResponseHeader stores only the first value from each header's value list in a Map. Follow cookie handling further to establish whether multiple Set-Cookie values survive. One passing session test does not reproduce complete browser behavior.

## Check repeatability before retrying

A lost response does not prove the server did not process a request. Orders and upload merging need idempotency keys to avoid duplicate effects after retries. Whether a file stream can be reread from the beginning also determines retry feasibility.

Test normal submissions, errors, slow responses, multiple cookies, file-read failures and server disconnects, checking that streams end. Lightweight wrappers reduce call-site code without removing these boundaries.

**References**

- [Nutz 1.b.53 Sender source](https://repo.maven.apache.org/maven2/org/nutz/nutz/1.b.53/nutz-1.b.53-sources.jar)
