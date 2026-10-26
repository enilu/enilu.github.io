---
source_sha256: 25b56287955cf441f3d6debbaee4f0d05831912747ea828729163a6598d24ce1
title: "Startup Engineering Quality: Refactoring, Testing and Release Feedback"
date: '2017-03-05'
lang: en
translation_key: startup-engineering-efficiency-quality
permalink: /en/2017/03/05/startup-engineering-efficiency-quality/
description: "Learn from a seven-hour refactoring outage to stage architecture changes, test complete message flows, clarify requirements and make releases recoverable."
---

A large refactoring caused an outage after deployment, leaving the service unavailable for about seven hours across the incident and rollback. Meanwhile, new features frequently failed testing or differed from the requested behavior. These experiences changed how I think about efficiency in a small team: time saved during coding can be paid back many times over in integration, deployment and rework.
<!--break-->

## Make architectural changes independently verifiable

The change combined an IoC container migration, business module separation and remote service calls. Two web projects became three consumer projects and four provider projects, with ZooKeeper and Redis added to the dependency chain. Both operating conditions and failure paths became more complicated.

We suspected performance bottlenecks without enough measurements. Splitting a system into microservices does not itself resolve them. Container migration and service separation also need not happen together. Choosing Spring was our integration decision at the time; it does not establish that another container cannot integrate with Dubbo.

Break the work into independently acceptable stages. For example, clarify module boundaries before making a business capability remote when it actually needs independent scaling. Each stage should identify the problem, the measurement that demonstrates improvement, and the rollback path. Choose the order according to project constraints rather than copying a prescribed sequence mechanically.

## Verify the complete dependency chain

One message flow went live with a producer but no consumer. Messages accumulated and the system became unresponsive. Whether a queue blocks producers or rejects writes depends on its implementation and capacity policy; this incident does not mean every queue waits indefinitely.

Acceptance must establish more than successful sending. Verify consumption, business state progression, and a recoverable failure state or retry path. Load tests should include consumption slower than production, stopped consumers and dependency timeouts, while measuring backlog, latency and resource use.

Unit tests cover rules and branches, integration tests cover component cooperation, and end-to-end tests cover complete business flows. Small teams can prioritize money handling, state transitions, complex algorithms and frequently changed areas. No single kind of test replaces all the others.

## Keep processes small, with concrete outputs

Every change does not need a long meeting. A significant architectural change does need documented dependencies, startup instructions, configuration, acceptance criteria and rollback procedures. Operations should know new components, network permissions and startup order beforehand. Developers need a reliable local or test environment.

| Stage | Minimum checks |
|---|---|
| Before development | Requirement examples, failure paths, boundaries and acceptance owner |
| Before merging | Code review, critical tests, configuration and data changes |
| Before release | Dependencies ready, backup and recovery, monitoring and stop conditions |
| After release | Core workflows, error rate, latency and message backlog |

Where gradual rollout is available, validate the new flow with limited traffic first. Otherwise, define maintenance arrangements and rollback triggers. Schema and data format changes require compatibility planning: an old application package alone is not a complete rollback plan.

## Do not relay requirements through just one person

Our team was small. The lead discussed requirements, divided work, developed features and investigated many problems. Other developers mostly implemented documents and task descriptions. A small headcount does not guarantee shared context; concentrating knowledge in one person still creates gaps.

Bring the implementing developers into requirement discussions early. Confirm inputs, outputs and boundary examples. Record changes in the shared task rather than leaving agreement in private conversations. Developers should test against acceptance examples, have a colleague inspect critical code and behavior, and then ask the requester to confirm the result.

A small company's speed comes from short feedback loops. Remove steps that produce nothing. Requirement clarification, risk validation and recoverable releases are the foundations that reduce rework and preserve speed.
