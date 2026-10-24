---
source_sha256: 3ae93859ab4ba8b5cd5169a23dbba8aa22553420a57795584c6b080b287f196d
title: Understanding Basic Linux Firewall Rules
date: '2015-09-09'
lang: en
translation_key: linux-iptables-basics
permalink: /en/2015/09/09/linux-iptables-basics/
description: Firewall diagnosis starts with the packet's chain, followed by rule order. These basics use the CentOS 6.5-era iptables filter table. Other systems may use firewalld or nftables; do not mix persistence mechanisms.
---

Firewall diagnosis starts with the packet's chain, followed by rule order. These basics use the CentOS 6.5-era iptables filter table. Other systems may use firewalld or nftables; do not mix persistence mechanisms.
<!--break-->

## Inspect rules and counters

```text
iptables -L INPUT -n -v --line-numbers
iptables -L OUTPUT -n -v --line-numbers
iptables -S
```

Line numbers identify rules, and counters help establish matches. INPUT handles packets addressed to this host, OUTPUT handles packets originating here, and FORWARD handles forwarded traffic. A listening port does not prove packets pass those rules.

## Order affects the result

Rules normally match sequentially. Once an earlier terminal rule accepts or rejects a packet, a later rule cannot change that decision. Appending an allow rule after a matching rejection may have no effect.

When allowing a database port, constrain source scope, protocol and destination port, and consider established connections and return traffic. Do not flush every rule to fix one service or permanently insert an allow-all-sources rule first.

## Verify runtime and persistence separately

Runtime additions are not necessarily saved. CentOS 6 commonly loads configuration through the iptables service; later distributions may differ. Save the current state, preserve remote management access, test a new connection, and persist through the system's chosen mechanism.

Reinspect line numbers before deletion because edits change them. Check default policy, loopback, IPv6 and external security groups too. Success means permitted sources connect, unpermitted sources are blocked, and behavior remains the same after reboot.

**References**

- [Netfilter documentation](https://www.netfilter.org/documentation/)
