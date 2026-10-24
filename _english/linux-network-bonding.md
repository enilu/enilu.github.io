---
source_sha256: a2517a2b6950ff4a64b0c6a31b52febb1b1ed162c0a5f7560367ef8a69a7dfcc
title: Understanding Linux Network Bonding
date: '2015-04-07'
lang: en
translation_key: linux-network-bonding
permalink: /en/2015/04/07/linux-network-bonding/
description: Linux bonding combines interfaces into a logical interface for redundancy or load sharing. It is not exclusive to CentOS and does not automatically move an IP between servers. Identify the failures to tolerate before selecting a mode.
---

Linux bonding combines interfaces into a logical interface for redundancy or load sharing. It is not exclusive to CentOS and does not automatically move an IP between servers. Identify the failures to tolerate before selecting a mode.
<!--break-->

## Compare common modes

| mode | Name | Main behavior |
|---|---|---|
| 0 | balance-rr | Packet round robin; assess switch requirements and reordering |
| 1 | active-backup | One active link with failover |
| 2 | balance-xor | Hash-based interface selection requiring network planning |
| 3 | broadcast | Sends through every member; not aggregate throughput |
| 4 | 802.3ad | Dynamic aggregation requiring matching switch LACP support |
| 5 | balance-tlb | Adaptive transmit load balancing |
| 6 | balance-alb | Adds handling for particular receive-load scenarios |

802.3ad is not simple primary/backup operation. Calling alb network-card virtualization is also imprecise. Aggregate bandwidth does not mean one connection can use every member's bandwidth at once; hashing and traffic distribution matter.

## Check both ends before configuration

Confirm speed, duplex, switch ports, VLAN and MTU. Layer 3 settings such as IP and gateway usually belong on the bond, without conflicting IPs on members. Connecting across switches depends on support for the intended aggregation or failover topology.

CentOS 6 ifcfg and modprobe configuration do not replace management through NetworkManager in later environments. Avoid multiple tools modifying one interface. Prepare console access and rollback before remote changes so a lost connection remains recoverable.

## Link detection does not prove service reachability

miimon detects physical link status, but an up interface does not establish working upstream routes or services. Select link or ARP monitoring according to the topology, and inspect members and mode in `/proc/net/bonding/bond0`.

Test disconnecting the active link, switch-port failures, restoration and continuous business requests. Record failover duration and packet loss. One successful switch does not prove the same detector recognizes every failure.

**References**

- [Documentation: docs.kernel.org](https://docs.kernel.org/networking/bonding.html)
