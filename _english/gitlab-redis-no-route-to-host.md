---
source_sha256: e972e2ecae5e7bf5c1fbb25ce3e7f92b55262027a90f642dcadda700af401d9b
title: 'A GitLab Redis Connection Failure: No Route to Host'
date: '2016-01-20'
lang: en
translation_key: gitlab-redis-no-route-to-host
permalink: /en/2016/01/20/gitlab-redis-no-route-to-host/
description: After security hardening on a test server, GitLab returned HTTP 500. Application logs pointed to Redis. Its process was running and its port listening, yet redis-cli connecting to loopback reported No route to host.
---

After security hardening on a test server, GitLab returned HTTP 500. Application logs pointed to Redis. Its process was running and its port listening, yet redis-cli connecting to loopback reported `No route to host`.
<!--break-->

## Narrow the application error to a connection path

```text
redis-cli -h 127.0.0.1 -p 6379 PING
```

Use the host, port and authentication actually configured in the application. `No route to host` can indicate firewall rejection rather than a missing route. Refusal, timeout and authentication failure provide different clues.

Check Redis's actual listening address and distinguish TCP from Unix sockets. Establish whether GitLab runs in a container or another network namespace. A process's 127.0.0.1 may not be the host's endpoint.

## An allow rule after rejection may never match

In this incident, connectivity returned when the firewall was disabled. The appended allow rule was after an earlier rejection. Inspecting INPUT, OUTPUT and loopback rules and correcting their order restored both the connection and GitLab.

This demonstrates ordering, not that disabling a firewall is the answer to all local connection failures. Inspect rules and counters first, identify the exact match, and make a minimal change for the required path.

## Do not expand Redis exposure incidentally

When a TCP client and Redis share a host, loopback binding usually suffices. Changing to `0.0.0.0` expands listening scope without fixing rules rejecting loopback traffic.

Allowing local access likewise does not imply opening 6379 to every source. Remote clients need explicit network scope, authentication and access control. Verify runtime and post-reboot rules, then test actual GitLab requests rather than stopping at a successful redis-cli connection.

**References**

- [iptables documentation](https://www.netfilter.org/documentation/)
- [Redis configuration](https://redis.io/docs/latest/operate/oss_and_stack/management/config/)
