---
source_sha256: 020ca31f71249652866e3ff899288945891e8fc1191e16104fd45e05490161d1
title: Investigating a Maven Dependency Resolution Failure
date: '2017-03-27'
lang: en
translation_key: maven-dependency-resolution
permalink: /en/2017/03/27/maven-dependency-resolution/
description: 'A Jenkins build listed many dependencies, but its most specific clue was Could not find metadata org.jetbrains:annotations-java5/maven-metadata.xml. Finding the actual failing artifact is more effective than immediately deleting the entire '
---

A Jenkins build listed many dependencies, but its most specific clue was `Could not find metadata org.jetbrains:annotations-java5/maven-metadata.xml`. Finding the actual failing artifact is more effective than immediately deleting the entire local repository.
<!--break-->

## Follow the exception chain to the coordinate

The dependency was `org.jetbrains:annotations-java5:jar:RELEASE`. RELEASE is a dynamic version selector requiring metadata, unlike a fixed version that identifies a particular artifact directly.

```text
mvn package -e
mvn dependency:tree
```

Inspect the dependency path, repository URLs, mirrors and settings.xml before checking cache and connectivity. The Maven command is `mvn`, not maven. Skipping tests is unrelated to resolving this dependency failure.

## Repair only the identified cache

Removing the affected dependency's local cache and downloading again restored this build. That does not make cache corruption the cause of all metadata failures. Missing remote artifacts, proxy errors and permissions can produce similar symptoms.

Confirm the actual local repository location before changing it, and limit cleanup to the identified group/artifact. `-U` requests update checks; it cannot create a nonexistent dependency. Repeated retries should not replace inspecting specific HTTP failures.

## Make builds reproducible

Pin validated versions and inspect transitive dependencies for dynamic selectors. Use dependencyManagement or an equivalent mechanism for consistent management. Keep the CI Maven, JDK, mirror and authentication configuration traceable.

Finally, verify with a clean cache or isolated build environment. A package already present on a developer machine does not prove the repository configuration works. Share only necessary errors and coordinates when distributing diagnostic logs.

**References**

- [Maven dependency mechanism](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html)
