---
layout: post
category : java 
keywords : "java基础,字符串处理"
description: "Java 字符串 API 有的接受普通文本，有的接受正则表达式。两者名称相近，参数含义却不同；使用 split 时尤其容易因为分隔符中的点号而得到意外结果。"
tags : [java基础]
lang: zh-CN
translation_key: java-split-contains
---

Java 字符串 API 有的接受普通文本，有的接受正则表达式。两者名称相近，参数含义却不同；使用 split 时尤其容易因为分隔符中的点号而得到意外结果。
<!--break-->

{% include JB/setup %}

## contains 查文本，split 用正则

```java
String value = "aaa.add.d";
System.out.println(value.contains("."));       // true
System.out.println(value.split(".").length);  // 0
System.out.println(value.split("\\.").length); // 3
```

这里展示 Java 源码时，最后一行的分隔参数应是 `"\\."`：字符串解析后得到反斜杠与点号，正则再把它解释为字面量点号。正则中的 `.` 匹配任意字符；split 又默认丢弃末尾空字符串，所以第二行长度为 0。

为避免手工处理转义，也可以使用 Pattern.quote：

```java
String[] parts = value.split(java.util.regex.Pattern.quote("."));
```

## 是否保留空字段也要明确

```java
System.out.println("a,b,".split(",").length);     // 2
System.out.println("a,b,".split(",", -1).length); // 3
```

负数 limit 保留末尾空字段，适合字段位置有含义的简单分隔文本。真正的 CSV 还涉及引号、转义和字段内换行，不能用一次 split 完整解析。

## 相似方法的区别

| 方法 | 参数含义 |
|---|---|
| `contains`、`startsWith`、`endsWith` | 字面文本 |
| `replace` | 字符或字面字符序列 |
| `matches`、`split` | 正则表达式；matches 要求整个字符串匹配 |
| `replaceAll`、`replaceFirst` | 查找参数为正则，替换参数也有特殊语法 |

替换字符串中的 `$` 和反斜杠也可能被解释。如果替换内容来自外部输入，希望按普通文本使用，可以通过 `Matcher.quoteReplacement` 处理。选择 API 时先明确是否需要正则，通常比不断增加反斜杠更不容易出错。

参考：[Java String](https://docs.oracle.com/javase/8/docs/api/java/lang/String.html)、[Pattern](https://docs.oracle.com/javase/8/docs/api/java/util/regex/Pattern.html)。
