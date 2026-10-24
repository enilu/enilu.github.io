---
layout: post
category : 学习笔记 
keywords: "nutz,源码学习"
description: "Streams 封装流的读写，Files 处理路径和文件；两者组合后调用很短，但资源归谁关闭、路径从哪里解析，仍需明确。本文以 Nutz 1.b.53 为基线。"
tags : [nutz,源码学习]
lang: zh-CN
translation_key: nutz-streams-files
---

Streams 封装流的读写，Files 处理路径和文件；两者组合后调用很短，但资源归谁关闭、路径从哪里解析，仍需明确。本文以 Nutz 1.b.53 为基线。
<!--break-->

{% include JB/setup %}

## 方法名里有资源约定

Streams.write 与 writeAndClose 对调用方的责任不同。写入一个流，也不等于已经关闭或完成持久化；复制字节与使用 Reader/Writer 进行字符编码，又是不同操作。

```java
try (InputStream input = new FileInputStream(source);
     OutputStream output = new FileOutputStream(target)) {
    Streams.write(output, input);
}
```

片段使用 java.io 类型与 org.nutz.lang.Streams，source、target 是不同的文件路径，目标已有内容会被覆盖，调用前需要确认。这里由 try-with-resources 统一持有并关闭资源，不再让内部方法也承担同样责任。

如果是 Servlet 响应流等由框架管理的资源，则先确认外层协议，不能不加区分地用一个 close 结束整个响应。

## 路径不只有绝对与相对

Files 与 Disks 会处理用户目录、应用路径或类路径等约定。波浪号展开是工具行为，不是 new File 自动支持的语法；运行用户不同，用户目录也会不同。

类路径资源还可能在 jar 中，资源 URL 不一定是普通磁盘文件。需要读取内容时优先取得流，不要总是把 URL 解码后当作本地路径。URL 编码与表单编码不同，也不能无条件用一次 URLDecoder 处理所有路径。

## 小工具仍需要边界样例

文件扩展名是对路径名称的约定，点文件、无扩展名、目录中含点、多个后缀都有不同情况。索引最后一个点可能比 split 更直接，但是否正确与更快，要根据语义和测量判断。

复制失败时可能留下部分目标；目录不存在和权限不足需要分别处理。对外部输入路径，还要校验最终路径是否位于允许目录内，避免把便利工具当成访问控制。

参考：[Nutz 1.b.53 Streams/Files 源码](https://repo.maven.apache.org/maven2/org/nutz/nutz/1.b.53/nutz-1.b.53-sources.jar)。
