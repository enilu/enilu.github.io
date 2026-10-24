---
source_sha256: 027d5ef2a1166be47f79242b75a2fe9b36d15751728ab8f1ac91b78e08a5884c
title: Using BeanShell for Configurable Monitoring Rules
date: '2013-03-14'
lang: en
translation_key: beanshell-monitoring-rules
permalink: /en/2013/03/14/beanshell-monitoring-rules/
description: Monitoring rules sometimes need several collected values, string comparisons or dynamic parameters rather than one fixed threshold. BeanShell embeds script execution in Java and provides a useful way to explore configurable rules.
---

Monitoring rules sometimes need several collected values, string comparisons or dynamic parameters rather than one fixed threshold. BeanShell embeds script execution in Java and provides a useful way to explore configurable rules.
<!--break-->

## Pass parameters from Java and retrieve the result

With BeanShell on the classpath, run this example using Java-like script expressions:

```java
import bsh.Interpreter;

public class RuleExample {
    public static void main(String[] args) throws Exception {
        Interpreter interpreter = new Interpreter();
        interpreter.set("a", 85);
        interpreter.set("b", 20);
        Object result = interpreter.eval("a > 80 && a - b > 50");
        if (!(result instanceof Boolean)) {
            throw new IllegalStateException("Rule must return a boolean");
        }
        System.out.println(result); // true
    }
}
```

BeanShell is not an operating-system shell. Calling Java classes from a script does not mean running bash. Check the Java syntax supported by the actual BeanShell version; arbitrary modern Java source is not guaranteed to execute.

## Stabilize rule inputs and outputs

Define each variable's type, units, missing-value behavior and valid range. Integer division differs from decimal division; a dynamic denominator may be zero, and string comparisons need null handling. A normal false result must differ from syntax and runtime errors, or broken configuration will look like an absence of alerts.

Evaluate sample data when saving a rule. After activation, record its ID, version and result so an alert can be explained against the conditions that generated it.

## Bound dynamic execution

A script able to call Java is not inherently a secure sandbox. Restrict configuration to trusted maintainers, limit exposed objects and manage execution resources and timeouts. Cancelling a Future cannot forcibly terminate arbitrary code that ignores interruption.

Do not share a mutable-variable Interpreter indiscriminately across concurrent requests. Change activation depends on reading, caching and deployment: saving a file does not automatically update every running instance. Restricted expressions or explicit strategies may be enough for simple rules without opening full scripting.

**References**

- [BeanShell](https://beanshell.github.io/)
