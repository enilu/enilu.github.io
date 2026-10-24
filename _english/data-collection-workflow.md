---
source_sha256: 9d7b3b2e082cc608732ddcb98b3dbed803ee816bfd5a1d90d80658a66c937089
title: A Practical Workflow for Data Collection
date: '2015-11-23'
lang: en
translation_key: data-collection-workflow
permalink: /en/2015/11/23/data-collection-workflow/
description: HTTP requests and parsing code are only the middle of a company-data collection workflow. Without clear scope, field meaning and acceptance criteria, successfully downloaded pages can still produce unusable data.
---

HTTP requests and parsing code are only the middle of a company-data collection workflow. Without clear scope, field meaning and acceptance criteria, successfully downloaded pages can still produce unusable data.
<!--break-->

## Turn “everything on the page” into a field list

A product page may contain subpages, paginated tables and asynchronously loaded sections. List required entities, fields, unique keys, time coverage and update frequency before development. Use real samples to agree on required and optional values.

Company profiles, shareholders and change histories have different structures. Being displayed on one website does not justify estimating them as one table. An empty list may mean no records, insufficient account access, a failed request or a changed page. Record these states separately.

Existing dictionaries can help normalize values, but postal codes and administrative areas are not always one-to-one. Keep raw and cleaned values separately and retain traceable conversion rules.

## Follow requests along the user journey

Within the permitted data scope, inspect browser requests from search to detail views. Establish methods, URLs, parameters, pagination and response types. A table may originate in HTML or be generated from JSON by JavaScript. Locate the data source instead of examining only the final page.

Login sessions, cookies and CSRF tokens have different roles. A particular header is not a universal access permission. Prefer the provider's API or export facility and respect agreed request rates.

## Make failures actionable states

Give jobs stable task IDs and data keys. Define connection and response timeouts, retry limits and backoff. Repeating a job should not create endless duplicates. Store timestamps and provenance to support later corrections.

Retain sufficient response samples to diagnose parsing failures, while controlling sensitive fields and retention. Even after parsing succeeds, validate field types and required values. Otherwise a broken selector can silently turn an entire batch of empty data into a successful result.

## Accept the complete data flow

| Stage | Checks |
|---|---|
| Retrieval | Request succeeds and the response contains the expected content |
| Parsing | Unique keys, required fields, pagination and nulls are correct |
| Storage | Deduplication, updates and deletions follow agreed rules |
| Use | Downstream queries and decisions apply the correct meaning |

Estimate effort from this complete flow. Start with representative samples, identify page variation and failure types, and then estimate expansion to the full scope. This is more reliable than promising a quick delivery merely because the data appears in a table.
