---
layout: post
category : linux
keywords : "Arthas,java应用诊断"
description: "线上任务没有按指定日期生成报表时，我用 Arthas 依次检查了正在运行的代码和方法入参，最终将问题缩小到参数内容。这个例子不复杂，但能说明如何减少反复加日志、重新发布的排查成本。"
tags : [运维,java]
lang: zh-CN
translation_key: arthas-java-production-diagnostics
---

线上任务没有按指定日期生成报表时，我用 Arthas 依次检查了正在运行的代码和方法入参，最终将问题缩小到参数内容。这个例子不复杂，但能说明如何减少反复加日志、重新发布的排查成本。
<!--break-->

{% include JB/setup %}

## 先列出需要验证的假设

需求是补生成最近 30 天的日报。我给已有定时任务增加了日期参数，配置 `{"reportDate":"2019-08-05"}` 后，结果却仍是当天的数据。代码在没有拿到日期时会默认使用当天，因此需要依次确认：部署的代码是否正确、参数是否到达目标方法、解析后是否得到有效日期。

本地测试通过，只能说明本地输入和环境下的行为正常，不能替代对线上这三件事的确认。

## 确认进程中实际加载的类

按 [Arthas 官方快速入门](https://arthas.aliyun.com/doc/quick-start.html) 下载启动器，以具有相应权限的账户附加到目标 Java 进程。工具版本要与目标 JDK 匹配，进程号也应与应用部署信息核对。

```text
java -jar arthas-boot.jar
sc -d com.xxx.schedule.job.ReportJob
jad com.xxx.schedule.job.ReportJob
```

`com.xxx.schedule.job.ReportJob` 是示例全限定类名，需换成实际任务类。`sc -d` 可以查看类加载器及代码来源，`jad` 展示反编译结果。若同名类由多个类加载器加载，需要按对应命令的 `-c` 参数指定 classloader hash，避免检查错对象。

这一步看到的实现与预期一致，于是继续检查运行时输入。反编译结果用于理解实际字节码对应的逻辑，并不保证还原出原始源文件的全部细节。

## 在方法入口观察入参

下面的命令只观察 3 次调用，在方法进入时输出参数，展开深度限制为 2：

```text
watch com.xxx.schedule.job.ReportJob execute '{params}' -b -n 3 -x 2
```

随后触发一次受控的任务执行。此时观察到日期参数确实传入，继续检查字符串，发现配置中混入了全角引号。正确 JSON 应使用半角双引号和冒号：

```json
{"reportDate":"2019-08-05"}
```

例如下面的文本就不是合法 JSON：

```text
{“reportDate":"2019-08-05"}
```

这类错误不应默默退化为默认日期。任务入口应区分“没有传日期”和“传了无法解析的日期”，后者记录清楚的失败原因并停止执行，避免生成看起来成功但日期错误的报表。

## 观察范围要与问题匹配

线上诊断优先选择明确的类、方法和字段，并限制次数与展开深度。入参可能包含身份信息或密钥，实际使用时只观察必要字段。不要为了排查一个日期把整个业务对象持续输出。

`watch` 需要对方法进行增强，观察表达式和输出也有成本。完成后结束监听，按工具文档恢复增强或停止 Arthas。工具能帮助验证假设，但参数校验、错误日志和自动化测试仍应在程序里做好。

参考：[watch 命令](https://arthas.aliyun.com/doc/watch.html)、[jad 命令](https://arthas.aliyun.com/doc/jad.html)。
