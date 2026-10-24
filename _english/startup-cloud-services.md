---
source_sha256: 3b4f9aab90424eb92086d28d7ee11c1664b963d9120992cb11bd72440bf5ed7a
title: Choosing Cloud Services for a Small Startup
date: '2016-05-24'
lang: en
translation_key: startup-cloud-services
permalink: /en/2016/05/24/startup-cloud-services/
description: For a startup, choosing cloud services is about concentrating limited engineering time on business differences. Managed services may reduce deployment and maintenance work, but evaluate bills, staff time and incident responsibility together
---

For a startup, choosing cloud services is about concentrating limited engineering time on business differences. Managed services may reduce deployment and maintenance work, but evaluate bills, staff time and incident responsibility together.
<!--break-->

## Neither self-hosting nor managed services are free

Self-hosted databases, code hosting and monitoring require installation, upgrades, backups, recovery exercises and on-call coverage. Managed services transfer part of that work to a provider while retaining configuration, authorization, capacity, networking and migration costs.

Comparing only server rental misses engineering time. Focusing only on saved labor can overlook traffic, storage growth and long-term fees. Compare costs at realistic scale.

## Security depends on responsibility boundaries

A cloud platform supplies infrastructure and service capabilities without automatically configuring application permissions, keys or data correctly. Keeping a server physically close does not make self-hosting safer either. Assign hardening, backup, recovery and auditing responsibilities in both models.

Where industry, geographic or customer constraints apply, establish data-processing and deployment requirements before selecting services. Claims that cloud is hundreds of times safer than a small company cannot replace evaluation.

## Start with clear benefits and replaceable boundaries

| Question | What to establish |
|---|---|
| The product is changing | Ease of trial and rollback; minimum spend or capacity commitments |
| No dedicated operations team | Exact managed scope and incident ownership |
| Migration may be needed | Export capability, recovery time and migration cost |
| Availability requirements increase | Whether backups, recovery objectives and exercises meet business needs |

Validate a noncore or clearly bounded case first, recording saved work and added costs before expanding. Avoid spending product-validation time indefinitely on building a complete infrastructure stack. Equally, an all-cloud ambition should not displace stable systems with very low maintenance costs without reason.

**References**

- [AWS Shared responsibility model](https://aws.amazon.com/compliance/shared-responsibility-model/)
