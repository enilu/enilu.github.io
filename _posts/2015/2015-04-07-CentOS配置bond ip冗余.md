---
layout: post
category : linux 
keywords : "linux,运维,ip bond"
description: "Linux bonding 把多个网络接口组成一个逻辑接口，提供链路冗余或流量分担。它不只属于 CentOS，也不等于在多台服务器之间自动漂移一个 IP；先明确希望防范的故障，再选择模式。"
tags : [linux,运维,ip bond]
lang: zh-CN
translation_key: linux-network-bonding
---

Linux bonding 把多个网络接口组成一个逻辑接口，提供链路冗余或流量分担。它不只属于 CentOS，也不等于在多台服务器之间自动漂移一个 IP；先明确希望防范的故障，再选择模式。
<!--break-->

{% include JB/setup %}

## 常见模式怎么选

| mode | 名称 | 主要行为 |
|---|---|---|
| 0 | balance-rr | 按报文轮转，需评估交换机条件与乱序 |
| 1 | active-backup | 一条链路工作，故障后切换 |
| 2 | balance-xor | 按哈希选择接口，需配合网络规划 |
| 3 | broadcast | 向所有成员发送，不等于聚合吞吐 |
| 4 | 802.3ad | 动态链路聚合，需要交换机 LACP 支持与匹配配置 |
| 5 | balance-tlb | 自适应发送负载分担 |
| 6 | balance-alb | 在发送分担基础上处理特定接收负载场景 |

802.3ad 不是简单的主备模式，alb 也不宜概括成“网卡虚拟化”。聚合的总带宽不意味着单条连接能同时获得所有成员带宽，效果受哈希策略和流量分布影响。

## 配置前核对两端

确认网卡速率、双工、交换机端口、VLAN 与 MTU。IP、网关等三层配置通常放在 bond 接口上，成员接口不再各自配置冲突的 IP。跨交换机接入还取决于交换机是否支持相应聚合或故障切换拓扑。

CentOS 6 时代的 ifcfg 与 modprobe 配置，不能直接替代 NetworkManager 等后续环境的管理方式。不要同时让多个管理工具修改同一接口。远程修改前准备控制台与回退方式，以免连接中断后无法恢复。

## 监测到链路不等于业务可达

miimon 可以检测物理链路状态，但接口显示 up，不代表上游路由和目标服务都正常。按网络设计选择链路或 ARP 等监测方式，并从 `/proc/net/bonding/bond0` 检查成员状态与当前模式。

测试应覆盖拔掉工作链路、交换机端口异常、链路恢复与连续业务请求，记录切换时间和丢包。某次能切换成功，不保证所有故障都能被同一种检测方式识别。

参考：[Linux bonding 驱动文档](https://docs.kernel.org/networking/bonding.html)。
