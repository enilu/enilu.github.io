---
source_sha256: 291ae89b9fafa2c68f9908ec18960ad53258ac6d734dc6af47f3a30fbb9ccd07
title: "Easy Mock Collaboration: API Contracts, Scenarios and Integration"
date: '2019-09-18'
lang: en
translation_key: easy-mock-contracts
permalink: /en/2019/09/18/easy-mock-contracts/
description: "Use Easy Mock for parallel development with explicit response contracts, error and stateful scenarios, compatible hosting dependencies and real API checks."
---

Mock services let frontend and backend development proceed in parallel by returning agreed responses before the backend is complete. Easy Mock is one tool I have used. The real artifact to maintain is the contract, rather than a collection of plausible JSON.
<!--break-->

## Agree on requests and responses first

Define methods, paths, parameters, status codes, types, nulls and pagination before generating examples. Include success, empty lists, invalid parameters, authorization failures and server errors. Randomly filling every field can obscure the difference between required and optional values.

Switch mock and real endpoints through environment configuration rather than scattering two address sets through business code. Use independent test accounts and data, without copying actual user information.

## Verify self-hosted dependencies as a set

Early Easy Mock environments used Node.js, MongoDB and Redis. Confirm the combination for the selected code version. Building under one Node major and casually running under another does not guarantee compatibility: native dependencies and runtime APIs may change.

If maintaining the old tool, pin code and environment versions, and verify installation, restart and backups. A public demo or personal service should not become a project's stable dependency. Critical workflows need an operating environment you control.

## Integration still follows mock testing

Mocks do not automatically validate real permissions, database state or concurrency. Stateful interfaces need explicit transitions in mock data. Returning success every time can hide duplicate-submission and conflict handling from frontend development.

Once the backend is available, compare real responses against the same contract examples and update documentation and mocks for discovered differences. Keeping mock behavior, contracts and implementation aligned reduces integration rework.

**References**

- [Easy Mock project](https://github.com/easy-mock/easy-mock)
