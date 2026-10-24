---
source_sha256: 558df252dcdcad086a70004ca1aa82d777d986d588e0fefae8671e2be953b089
title: 'Reading Nutz Strings: Unicode, Width and Case'
date: '2016-06-03'
lang: en
translation_key: nutz-strings-unicode
permalink: /en/2016/06/03/nutz-strings-unicode/
description: It is easy to mistake an application-specific character classification for Unicode's complete definition. Nutz 1.b.53 Strings offers Chinese-character, full-width/half-width and case helpers. Understanding them starts with whether an API ac
---

It is easy to mistake an application-specific character classification for Unicode's complete definition. Nutz 1.b.53 Strings offers Chinese-character, full-width/half-width and case helpers. Understanding them starts with whether an API accepts a char or a complete code point.
<!--break-->

## UnicodeBlock identifies blocks

isChineseCharacter uses UnicodeBlock and returns true for some punctuation and width forms too. It expresses the utility's classification rather than accurately identifying the language of a passage.

A Java char is one UTF-16 code unit. Supplementary-plane characters require two chars. Even if EXTENSION_B appears in source, an API accepting one char cannot fully represent those characters.

```java
String text = "𠀀";
System.out.println(text.length());                         // 2
System.out.println(text.codePointCount(0, text.length())); // 1
```

String length, code-point count and the number of visible glyphs also differ. With emoji or combining characters, counting charAt calls does not count displayed characters reliably.

## Width conversion covers specific ranges

Full-width ASCII forms U+FF01 through U+FF5E differ from ASCII by 65248, with the U+3000 space handled separately. This offset does not apply to every Chinese punctuation mark; U+3002, the ideographic full stop, lies outside the range.

Whether a character occupies two display cells also depends on the terminal, font and width policy. An older utility's wide-character categories cannot determine every UI layout.

## Consider case rules before performance

ASCII case can use simple range transformations, but general Unicode casing has language-dependent and length-changing rules. Choose Character or String APIs according to requirements and specify Locale where stable language behavior matters.

Estimating StringBuilder capacity from a known length can reduce resizing, but two lines of code do not establish relative performance. Prioritize correctness and readability, measure real hot paths, and then consider micro-optimization.

**References**

- [Java Character](https://docs.oracle.com/javase/8/docs/api/java/lang/Character.html)
- [Nutz 1.b.53 Strings source](https://repo.maven.apache.org/maven2/org/nutz/nutz/1.b.53/nutz-1.b.53-sources.jar)
