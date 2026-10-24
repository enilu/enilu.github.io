---
source_sha256: 8d839a4b7d1b541d295e97663780b6eb57e4e286f7ceb5b04941b05c85322839
title: "A Connection Validation Failure After Upgrading the MySQL JDBC Driver"
date: 2022-10-27
lang: en
translation_key: mysql-driver-upgrade-connection-validation
permalink: /en/2022/10/27/mysql-driver-upgrade-connection-validation/
description: "A JDBC driver upgrade incident, separating an observed recovery from an unproven compatibility claim."
---

After a vulnerability scan, a project needed a newer MySQL Java driver. I changed `mysql-connector-java` from 5.1.24 to 8.0.28 and then encountered `java.sql.SQLException: validateConnection false`.

Connections recovered after Druid was changed to 1.2.12. That recovery alone does not establish the root cause, however, and it cannot define a general compatibility matrix.
<!--break-->

## What changed at the time?

The driver dependency was upgraded from 5.1.24 to 8.0.28:

```xml
<!-- Version used for this upgrade. -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.28</version>
</dependency>
```

Connection validation failed after the upgrade. Following further adjustments, connections worked with Druid 1.2.12. This restored connections, but the specific failure mechanism was not identified. The recovery outcome therefore needs to be distinguished from a root-cause conclusion.

## What does validateConnection false mean?

In Druid 1.2.12, `DruidAbstractDataSource.validateConnection` throws `validateConnection false` when a configured `validConnectionChecker` reports failure. Some exception paths also attach a cause.

The message establishes that connection validation failed. It does not by itself establish driver/pool incompatibility. The checker implementation, full exception chain and runtime configuration are needed for further diagnosis. When diagnosing another version, inspect its corresponding implementation.

## Provided Dependencies is not a compatibility matrix

A dependency website's Provided Dependencies section can be mistaken for a compatibility list. Its meaning comes from the project's POM and Maven dependency scopes.

The official POM for Druid 1.2.12 declares:

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.21</version>
    <scope>provided</scope>
</dependency>
```

`provided` describes Maven dependency scope, not a certified compatibility range. It also means this driver is not brought into a consuming project as an ordinary transitive dependency. Declaring a version does not prove that only that version works; seeing another version on a website does not prove that every version in between is compatible.

## Follow the connection creation and validation path

| Check | Question to answer |
|---|---|
| Runtime dependencies | Which driver and pool versions are actually packaged and loaded? Are duplicate dependencies present? |
| Environment | What are the JDK, MySQL server, JDBC URL and connection validation settings? |
| Exception chain | What is the underlying exception? Are there SQLState values, error codes or supporting logs? |
| Minimal connection test | Can direct JDBC connect using the same runtime environment and connection parameters? |
| Controlled comparison | With other conditions unchanged, do separate driver and pool changes reproduce consistent results? |
| Regression checks | Do restart, connection borrowing/return and borrowing after idle periods work? |

For example, inspect the dependencies resolved by Maven, then compare them with the actual runtime package:

```text
mvn dependency:tree -Dincludes=mysql:mysql-connector-java,com.mysql:mysql-connector-j,com.alibaba:druid
```

A direct JDBC test can narrow the investigation, but success does not rule out a failure specific to the pool's validation path. After changing dependencies, verify the important business operations and connection lifecycle under the real configuration, rather than checking only whether the application starts.

## Verify the full connection lifecycle after upgrading

Using Druid 1.2.12 restored connections in this project. Application startup is only the first check, however. Connection creation, validation, reuse and recovery must also behave as expected.

A dependency upgrade involves cooperation between the driver, connection pool and server. Preserve the environment and exception details, narrow the problem with a minimal reproducer, and follow up with controlled comparisons and regression checks rather than relying on apparently matching version numbers.

## References

- [Druid 1.2.12: connection validation implementation](https://github.com/alibaba/druid/blob/1.2.12/src/main/java/com/alibaba/druid/pool/DruidAbstractDataSource.java)
- [Druid 1.2.12: POM](https://github.com/alibaba/druid/blob/1.2.12/pom.xml)
- [Maven: dependency mechanism and scopes](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html)
