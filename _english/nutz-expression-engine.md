---
source_sha256: 47238eceafa845afa4c65624b76f320f566d873340a84fcb9975dac93ae44610
title: "Nutz 1.b.53 EL: Parsing, Precedence and Evaluation Limits"
date: '2016-01-17'
lang: en
translation_key: nutz-expression-engine
permalink: /en/2016/01/17/nutz-expression-engine/
description: "Follow Nutz 1.b.53 EL from tokens to precedence and evaluation, checking context variables, result types, failures and configurable-rule execution limits."
---

An expression engine turns condition text into a result. Nutz EL can be understood by following token recognition, precedence handling and evaluation rather than memorizing package names. These examples use 1.b.53.
<!--break-->

## Start with an alert condition

```java
import org.nutz.el.El;
import org.nutz.lang.Lang;
import org.nutz.lang.util.Context;

Context values = Lang.context();
values.set("a", 85);
values.set("b", 20);
Object result = El.eval(values, "a > 80 && a - b > 50");
```

This is a calling fragment. Check result against the rule's expected type rather than casting unconditionally to Boolean. Establish behavior with missing variables and different numeric types too.

## Follow precedence into evaluation

org.nutz.el.parse handles expression tokens, obj represents operands and opt represents operations. In the arithmetic package, ShuntingYard and RPN correspond to handling infix expressions and evaluating reverse Polish form.

For example, `1 + 2 * 3` must not simply execute left to right. Precedence requires multiplication before addition; parentheses change grouping. Start with small expressions without variables, then add context variables and comparisons to see the boundary between transformation and evaluation.

## Validate configurable rules independently

Define division-by-zero, null, integer precision and return-type behavior. Record false results separately from evaluation errors and retain rule versions and sample inputs so decisions remain explainable.

The application and implementation version must explicitly restrict callable capabilities. The name EL does not guarantee isolation from files, networking or arbitrary methods. Limit provenance, length and execution resources before accepting external expressions. Test even trusted rules before activation.

**References**

- [Nutz 1.b.53 source archive](https://repo.maven.apache.org/maven2/org/nutz/nutz/1.b.53/nutz-1.b.53-sources.jar)
