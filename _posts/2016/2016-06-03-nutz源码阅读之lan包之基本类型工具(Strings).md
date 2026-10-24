---
layout: post
category : 学习笔记 
keywords: "nutz,源码学习"
description: "读字符串工具时，很容易把某种业务分类当成 Unicode 的完整定义。Nutz 1.b.53 的 Strings 提供中文字符、全半角和大小写等方法，理解它们需要先看接受的是 char 还是完整码点。"
tags : [nutz,源码学习]
lang: zh-CN
translation_key: nutz-strings-unicode
---

读字符串工具时，很容易把某种业务分类当成 Unicode 的完整定义。Nutz 1.b.53 的 Strings 提供中文字符、全半角和大小写等方法，理解它们需要先看接受的是 char 还是完整码点。
<!--break-->

{% include JB/setup %}

## UnicodeBlock 判断的是区块

isChineseCharacter 使用 UnicodeBlock，并把部分标点和全半角形式也归入返回 true 的范围。因此它体现的是工具自己的字符分类，不是准确识别一段文本所用语言的算法。

Java 的 char 是一个 UTF-16 编码单元。补充平面的字符需要两个 char，即使源码列出了 EXTENSION_B，也不能用接收单个 char 的接口完整处理这些汉字。

```java
String text = "𠀀";
System.out.println(text.length());                         // 2
System.out.println(text.codePointCount(0, text.length())); // 1
```

字符串长度、码点数量和用户看到的字形数量还不总是相同。处理表情或组合字符时，不能简单把 charAt 的次数当成显示字符数。

## 全半角转换只对特定范围成立

全角 ASCII 形式 U+FF01 到 U+FF5E 与对应 ASCII 相差 65248，U+3000 空格单独处理。这个偏移不能用于所有中文标点，例如中文句号 U+3002 不在该范围内。

字符是不是“显示两格”，还涉及终端、字体和宽度策略，不能用旧工具中的宽字符分类推断所有 UI 排版。

## 大小写和性能

ASCII 大小写可以做简单范围变换，但一般 Unicode 大小写存在语言和长度变化规则。按业务选择 Character 或 String 的转换接口，并在需要稳定语言规则时明确 Locale。

已知字符串长度时给 StringBuilder 预估容量可能减少扩容，但不能仅凭两行代码就断言性能优劣。优先保证边界与可读性，在真实热点上测量，再考虑微优化。

参考：[Java Character](https://docs.oracle.com/javase/8/docs/api/java/lang/Character.html)、[Nutz 1.b.53 Strings 源码](https://repo.maven.apache.org/maven2/org/nutz/nutz/1.b.53/nutz-1.b.53-sources.jar)。
