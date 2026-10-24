---
source_sha256: 32dfb67978d93b4cea0075ea7f76ae7834247d90033de0eaba0fc0591bee2c83
title: 'Adapting Guns to JPA: The Decisions Behind guns-lite'
date: '2018-04-05'
lang: en
translation_key: guns-lite-jpa-adaptation
permalink: /en/2018/04/05/guns-lite-jpa-adaptation/
description: 'When a new product needed an admin interface quickly, I adapted Guns instead of building every page from scratch. Other services already used Spring Data JPA, so I moved the admin data-access layer to JPA as well, aiming to reduce the cost '
---

When a new product needed an admin interface quickly, I adapted Guns instead of building every page from scratch. Other services already used Spring Data JPA, so I moved the admin data-access layer to JPA as well, aiming to reduce the cost of maintaining two data-access approaches.
<!--break-->

## Why I adapted the original project

Guns used MyBatis at the time, while our shared data layer used JPA. They can coexist and be isolated behind interfaces, but maintaining two sets of mappings and queries increased synchronization work in this project. This was a contextual team choice, not a general claim that JPA is superior.

The result was [guns-lite](https://github.com/enilu/guns-lite), using Spring Boot, Spring Data JPA, Shiro, Druid, Ehcache, Beetl and Bootstrap in that implementation. This describes the historical project rather than the complete current upstream stack.

## The cost of developing features during migration

The project missed the original two-week release estimate. As business and external requirements changed, the old version kept developing while the new version caught up. Replacement completed about two weeks later. Supporting both consumed requirement synchronization and behavioral comparison effort as well as coding time.

For another migration, I would define acceptance examples for login, authorization, menus, pagination and critical workflows, then replace parts incrementally. Set an explicit point at which development on the old implementation stops, so the two do not chase each other indefinitely.

## Reusing data access takes more than annotations

Compare page numbering, transactions, lazy loading, query sorting and bulk operations. Shared services should express stable business rules rather than expose every database operation to the admin interface merely for reuse.

Revalidate permissions and data scope. Reusing a DAO does not automatically preserve the caller's appropriate authorization. Code generation reduces forms and simple CRUD work but does not produce complete state constraints or business error handling.

## Define the boundaries of an open-source adaptation

Before choosing scaffolding, inspect its license, maintenance, dependencies and replaceable parts, then estimate customization and ongoing upgrade costs. An adaptation suited to one team can be useful, but users still need to validate their versions and requirements. Screenshots do not establish compatibility.

Project: [enilu/guns-lite](https://github.com/enilu/guns-lite).
