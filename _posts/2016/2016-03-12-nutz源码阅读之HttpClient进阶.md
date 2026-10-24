---
layout: post
category : 学习笔记 
keywords: "nutz,源码学习"
description: "GET 请求看懂以后，再读 POST、文件上传和 Cookie，可以看到一个轻量 HTTP 工具怎样处理状态与资源。下面继续使用 Nutz 1.b.53，不把这个版本的超时常量当成所有版本的默认值。"
tags : [nutz,源码学习]
lang: zh-CN
translation_key: nutz-http-client-details
---

GET 请求看懂以后，再读 POST、文件上传和 Cookie，可以看到一个轻量 HTTP 工具怎样处理状态与资源。下面继续使用 Nutz 1.b.53，不把这个版本的超时常量当成所有版本的默认值。
<!--break-->

{% include JB/setup %}

## 请求体的类型影响发送方式

Sender.create 将部分方法交给 PostSender，文件表单则有 FilePostSender。表单字段、原始字节、流和 multipart 是不同的请求表示，参数对象的类型决定工具怎样写入正文。

上传时不仅要把文件内容写到输出流，还要正确处理 multipart 边界、字段头、编码和关闭。是否缓冲整个内容、能否确定 Content-Length，也会影响内存与传输行为，不能只凭 send 这个入口判断。

## 连接超时与读取超时

该版本 Sender 的默认连接超时为 30 秒，默认读取超时为 10 分钟，最终通过 HttpURLConnection 设置。读取超时通常限制一次等待数据的时间，不是整个业务流程的绝对截止时间。

调用便利接口时还要跟进参数最终设置到哪个字段，不能把一个 timeout 参数理解成同时覆盖 DNS、连接、读取和业务重试。外层如果需要总耗时上限，应单独设计并验证取消能否真正释放资源。

## Cookie 需要按协议处理

请求使用 Cookie 头，响应使用 Set-Cookie，两者不是同一字段。名称比较、多个同名响应头、Domain、Path 和过期信息，都可能影响会话是否正确复用。

1.b.53 的 getResponseHeader 将每个字段列表的第一个值放入 Map，因此阅读 Cookie 处理时需要继续检查多条 Set-Cookie 的保留情况，不能仅因单个会话测试通过就认定浏览器行为已经完整复现。

## 重试先判断业务是否可重复

网络断开时，客户端未拿到响应不代表服务端没有处理。订单、上传合并等请求要有幂等标识，避免简单重试产生重复操作。文件流是否还能从头读取，也决定重试是否成立。

测试覆盖正常提交、错误响应、慢响应、多 Cookie、文件读取失败和服务端中途断开，并检查流是否结束。轻量封装减少调用代码，不会自动消除这些边界。

参考：[Nutz 1.b.53 Sender 源码](https://repo.maven.apache.org/maven2/org/nutz/nutz/1.b.53/nutz-1.b.53-sources.jar)。
