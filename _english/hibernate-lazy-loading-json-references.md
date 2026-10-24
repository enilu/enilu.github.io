---
source_sha256: aff167ddbd3323e7b174c5c19391d2e29faa7774af993caf638c428cc4a854cc
title: Hibernate Lazy Loading and Fastjson References in List Responses
date: '2018-07-03'
lang: en
translation_key: hibernate-lazy-loading-json-references
permalink: /en/2018/07/03/hibernate-lazy-loading-json-references/
description: A paginated API returned an organization as a complete org object in its first row, then as $ref in later rows. Frontend code reading org.name failed. Understanding this requires separating association loading from the serializer's represen
---

A paginated API returned an organization as a complete `org` object in its first row, then as `$ref` in later rows. Frontend code reading `org.name` failed. Understanding this requires separating association loading from the serializer's representation of shared objects.
<!--break-->

## Repeated references and lazy loading are different

Several records associated with one organization may reference the same Org instance within one persistence context. Fastjson 1.x reference detection can represent subsequent appearances as paths:

```json
{
  "rows": [
    {"id": 1, "org": {"id": 7, "name": "示例机构"}},
    {"id": 2, "org": {"$ref": "$.rows[0].org"}}
  ]
}
```

This is parseable JSON, but ordinary frontend code does not resolve `$ref` automatically. Sharing does not necessarily create a cycle. Two records pointing to one organization differs from the organization pointing back to those records.

Hibernate lazy loading controls when an association is fetched. Accessing a proxy may execute a query or fail after its persistence context closes. `$ref` indicates a reference in serialized output; it does not by itself prove that a proxy class could not be parsed.

## Return an independent API data structure

A maintainable solution is to query and assemble a DTO containing only the fields the API needs:

```json
{
  "rows": [
    {"id": 1, "orgId": 7, "orgName": "示例机构"},
    {"id": 2, "orgId": 7, "orgName": "示例机构"}
  ]
}
```

Fetch the name during querying or mapping and observe the SQL count. Avoid one extra query per mapped row. With pagination, verify totals, duplicate rows and page behavior when using fetch joins, projections or batch queries.

## Configuration switches solve specific problems

Fastjson 1.x `SerializerFeature.DisableCircularReferenceDetect` disables reference detection, expanding a shared object repeatedly. With a real cycle, however, disabling detection may cause recursion or stack overflow. It should not be the default repair for every entity-returning endpoint.

Changing an association from LAZY to EAGER also does not remove object sharing. It can introduce unnecessary queries or an oversized graph. Define the API's required data before controlling fetching and output structure.

Check Fastjson2 options and defaults for the actual version instead of copying 1.x settings. Test missing associations, shared organizations, bidirectional associations and detached data. Inspect both JSON structure and database query counts.

**References**

- [Fastjson2 migration guide](https://github.com/alibaba/fastjson2/wiki/fastjson_1_upgrade_cn)
- [Documentation: docs.jboss.org](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
