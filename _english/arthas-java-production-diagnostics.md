---
source_sha256: 4a018e268f3d4eaf8c9bf30c7c44892732da0f9160a3133a73182c5281509ba9
title: Diagnosing a Production Java Application with Arthas
date: '2019-09-06'
lang: en
translation_key: arthas-java-production-diagnostics
permalink: /en/2019/09/06/arthas-java-production-diagnostics/
description: When a production job failed to generate a report for the requested date, I used Arthas to inspect the running code and method arguments. The investigation eventually narrowed the problem down to the parameter text. It is a small example of
---

When a production job failed to generate a report for the requested date, I used Arthas to inspect the running code and method arguments. The investigation eventually narrowed the problem down to the parameter text. It is a small example of avoiding repeated logging changes and deployments during diagnosis.
<!--break-->

## List the hypotheses to test

The task was to regenerate daily reports for the preceding 30 days. I added a date parameter to an existing scheduled job, but configuring `{"reportDate":"2019-08-05"}` still produced today's data. The code defaults to today when it cannot obtain a date. I therefore needed to verify the deployed implementation, whether the parameter reached the method, and whether parsing produced a valid date.

A passing local test establishes behavior for local inputs and conditions. It cannot answer those three production questions.

## Inspect the class actually loaded in the process

Download the launcher following the [Arthas quick start](https://arthas.aliyun.com/doc/quick-start.html), and attach to the target Java process with an appropriately authorized account. Match the tool version to the target JDK and verify the process ID against the deployment information.

```text
java -jar arthas-boot.jar
sc -d com.xxx.schedule.job.ReportJob
jad com.xxx.schedule.job.ReportJob
```

Replace the example fully qualified name `com.xxx.schedule.job.ReportJob` with the actual job class. `sc -d` shows the classloader and code source; `jad` shows decompiled code. If several classloaders load the same name, use the command's `-c` argument to select the appropriate classloader hash.

The implementation matched my expectations, so I moved on to runtime inputs. Decompiled code helps explain the logic represented by bytecode; it does not reproduce every detail of the original source.

## Observe arguments at method entry

This command observes only three calls, prints arguments on entry, and limits expansion depth to two:

```text
watch com.xxx.schedule.job.ReportJob execute '{params}' -b -n 3 -x 2
```

I then triggered a controlled execution. The date parameter did reach the method, but closer inspection revealed a full-width quotation mark in the configuration. Valid JSON uses ordinary double quotes and a colon:

```json
{"reportDate":"2019-08-05"}
```

For example, the following text is invalid JSON:

```text
{“reportDate":"2019-08-05"}
```

An error like this should not silently fall back to the default date. The job should distinguish an omitted date from an unparseable supplied date. For the latter, record a clear failure and stop, rather than producing a seemingly successful report for the wrong day.

## Keep observation proportional to the problem

Target specific classes, methods and fields, with bounded counts and expansion depth. Arguments may contain personal information or credentials: inspect only the necessary fields instead of continuously printing an entire business object to investigate one date.

`watch` instruments methods, and evaluating expressions and producing output have a cost. End the listener when finished, then restore instrumentation or stop Arthas as documented. Diagnostic tools test hypotheses; input validation, useful errors and automated tests still belong in the application.

**References**

- [Documentation: arthas.aliyun.com](https://arthas.aliyun.com/doc/watch.html)
- [Documentation: arthas.aliyun.com](https://arthas.aliyun.com/doc/jad.html)
