---
source_sha256: 0600ae1c41c1fc99dbd7209e29fcdb5050eccb60a907fa3d4ed76f003bec74d0
title: Custom Functions After a Jxls Upgrade
date: '2022-03-04'
lang: en
translation_key: jxls-custom-functions-upgrade
permalink: /en/2022/03/04/jxls-custom-functions-upgrade/
description: Custom functions in Jxls templates can format dates and amounts or perform small presentation calculations. If an upgrade makes functions disappear, inspect expression-engine namespace configuration before changing every template.
---

Custom functions in Jxls templates can format dates and amounts or perform small presentation calculations. If an upgrade makes functions disappear, inspect expression-engine namespace configuration before changing every template.
<!--break-->

## Identify the JEXL configuration change

These fragments illustrate two Apache Commons JEXL API styles. The correct one depends on the project's Jxls evaluator and JEXL major version. They are not interchangeable recipes for every old and new Jxls release.

A configuration fragment using JEXL 2 APIs:

```java
Map<String, Object> funcs = new HashMap<>();
funcs.put("utils", new ExcelFunction());
evaluator.getJexlEngine().setFunctions(funcs);
```

With JEXL 3 `JexlBuilder`, supply namespaces when constructing the engine:

```java
Map<String, Object> funcs = new HashMap<>();
funcs.put("utils", new ExcelFunction());
JexlEngine engine = new JexlBuilder().namespaces(funcs).create();
evaluator.setJexlEngine(engine);
```

The `evaluator` must be an implementation exposing these methods in the relevant version. `ExcelFunction` is an application-provided class. JEXL 2 and 3 have different packages; avoid runtime dependencies that differ from the compile-time versions. Newer Jxls releases may expose their own builder configuration, so follow the documentation for the selected major version.

## Check function names together with templates

Templates call functions through the `utils` namespace, so do not casually rename that map key. Use clear public method signatures and avoid excessive overloading that makes resolution ambiguous. Prefer BigDecimal for amounts with explicit rounding rules, and establish a timezone for date formatting.

Register only functions templates actually need. Do not expose an entire business service or objects with side effects to the expression engine. Template provenance, engine permissions and callable function scope are part of the runtime conditions too.

## Verify the generated workbook

Use a minimal template with fixed data to test ordinary values, nulls, invalid input and failed calls. Reopen the resulting workbook and inspect cell values, types and formatting. A displayed date string differs from a real date cell.

Finally, ensure the custom engine is configured before template execution and actually used by the transformation. Calling a configuration method without wiring its result into the transformer still leaves the template unable to find the function.

**References**

- [Apache Commons JEXL](https://commons.apache.org/proper/commons-jexl/)
- [Jxls project](https://github.com/jxlsteam/jxls)
