---
layout: post
category : 问题集锦 
keywords : "gitlab,redis,linux"
description: "测试服务器做完安全加固后，GitLab 页面返回 500。检查应用日志，问题指向 Redis 连接；进程存在、端口也在监听，但 redis-cli 连接回环地址仍然报 No route to host。"
tags : [gitlab,redis,linux]
lang: zh-CN
translation_key: gitlab-redis-no-route-to-host
---

测试服务器做完安全加固后，GitLab 页面返回 500。检查应用日志，问题指向 Redis 连接；进程存在、端口也在监听，但 redis-cli 连接回环地址仍然报 `No route to host`。
<!--break-->

{% include JB/setup %}

## 从应用错误缩小到连接路径

```text
redis-cli -h 127.0.0.1 -p 6379 PING
```

命令应使用应用实际配置的主机、端口和认证方式。`No route to host` 不一定表示缺少路由，也可能与防火墙的拒绝方式有关；连接拒绝、超时和认证失败则各有不同线索。

确认 Redis 实际监听地址，区分 TCP 与 Unix socket，以及 GitLab 是否运行在容器或另一个网络命名空间。某个进程里的 127.0.0.1，不一定与宿主机是同一个端点。

## 规则放在拒绝之后不会生效

这次排查中，关闭防火墙后连接恢复，随后发现追加的放行规则位于更早的拒绝规则之后。重新检查 INPUT、OUTPUT 和回环接口规则，调整匹配顺序后，连接与页面恢复。

这个过程说明规则顺序很重要，不代表所有本机连接问题都应该通过关闭防火墙解决。优先查看规则和计数，定位确切命中，再对必要路径做最小修改。

## 不要顺带扩大 Redis 暴露范围

如果客户端与 Redis 在同一主机且使用 TCP，绑定回环地址通常已经满足需求。改成 `0.0.0.0` 会扩大监听范围，并不能修复回环流量被规则拒绝的问题。

同理，允许本机访问也不等于应向所有来源开放 6379。远程客户端需要单独明确网络范围、认证和访问控制。修复后检查运行时及重启后的规则，再验证实际 GitLab 请求，而不只看 redis-cli 能连上。

参考：[iptables 基础](https://www.netfilter.org/documentation/)、[Redis 配置](https://redis.io/docs/latest/operate/oss_and_stack/management/config/)。
