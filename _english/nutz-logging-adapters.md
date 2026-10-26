---
source_sha256: c5cd3dd8a8bb9b286b56b6a9447b8ef0c216c4f7590e49ea089f8c9a89015653
title: "Nutz 1.b.53 Logging: Interfaces, Adapter Selection and Initialization"
date: '2016-10-16'
lang: en
translation_key: nutz-logging-adapters
permalink: /en/2016/10/16/nutz-logging-adapters/
description: "Inspect Nutz logger naming, Log4j/System adapter selection, initialization and NOP_ADAPTER, including saved references, bridge duplication and logging costs."
---

Nutz logging provides a common interface and adapters for concrete outputs. The important paths are how business code obtains a logger and how runtime selection chooses an adapter. This uses 1.b.53; adapter lists and priorities must not be inferred across versions.
<!--break-->

## Three responsibility layers

| Type | Responsibility |
|---|---|
| Logs | Static factory and adapter selection |
| Log | Level checks and output methods |
| LogAdapter | Produces a Log by name through getLogger |

```java
import org.nutz.log.Log;
import org.nutz.log.Logs;

public class ExampleService {
    private static final Log log = Logs.getLog(ExampleService.class);
    public void run() {
        log.info("task started");
    }
}
```

Passing the class explicitly makes the name clear. Logs.get() can infer it from the call stack. Do not confuse this with a nonexistent Logs.get(Class) overload.

## Default selection belongs to a specific version

In 1.b.53, Logs.init uses SimplePluginManager to try Log4jLogAdapter and then SystemLogAdapter. Availability checks determine the selection; merely seeing a logging jar on the classpath does not prove it is active. Later releases may offer other adapters, so inspect their implementation.

Logs.setAdapter permits explicit selection, but existing saved Log references may not switch afterward. Choose the adapter consistently during initialization. NOP_ADAPTER is a no-output null-object implementation, not an unfinished error branch.

## Logging facades still require maintenance

A shared interface separates business code from implementations, but bridges and adapters can create duplicate output or cycles. Inspect the actual binding, loaded configuration and call path instead of adding several bridges experimentally.

Levels, exception traces and context determine diagnostic value. High volume consumes I/O and content may expose sensitive data. Design logs around observability goals rather than merely proving that one line can be printed.

**References**

- [Nutz 1.b.53 Logs source](https://repo.maven.apache.org/maven2/org/nutz/nutz/1.b.53/nutz-1.b.53-sources.jar)
