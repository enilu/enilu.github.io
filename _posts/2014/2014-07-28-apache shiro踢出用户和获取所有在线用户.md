---
layout: post
category : java 
tags : [开源,java,apache,权限管理]
description: "“同一账号只允许一个会话”需要先定义冲突策略：新登录替换旧登录，还是拒绝新登录。本文讨论前者，并区分单进程会话枚举与多实例下的统一控制。"
lang: zh-CN
translation_key: shiro-single-session-login
---

“同一账号只允许一个会话”需要先定义冲突策略：新登录替换旧登录，还是拒绝新登录。本文讨论前者，并区分单进程会话枚举与多实例下的统一控制。
<!--break-->

{% include JB/setup %}

## 会话管理先接入正确的 SessionDAO

下面是采用 Shiro 原生 Web Session 的单实例配置片段，需放在已有 Spring beans 配置中：

```xml
<bean id="sessionDAO" class="org.apache.shiro.session.mgt.eis.MemorySessionDAO"/>
<bean id="sessionManager" class="org.apache.shiro.web.session.mgt.DefaultWebSessionManager">
    <property name="sessionDAO" ref="sessionDAO"/>
</bean>
<bean id="securityManager" class="org.apache.shiro.web.mgt.DefaultWebSecurityManager">
    <property name="realm" ref="shiroDbRealm"/>
    <property name="sessionManager" ref="sessionManager"/>
</bean>
```

MemorySessionDAO 只保存当前进程内的会话，重启会丢失，多个节点也不会自动共享。使用 Servlet 容器会话或无状态 Token 的系统，需要按自己的认证机制实现，不能直接复制这个配置。

## 身份验证成功后再处理旧会话

不要在密码尚未验证成功时就踢出旧会话，否则知道用户名的人可以通过失败登录干扰正常用户。先完成认证，拿到稳定的用户 ID 和新会话 ID，再查找同一用户的其他会话。

会话里的 principal 往往是 PrincipalCollection 或自定义对象，不能将整个对象 `toString()` 后与用户名比较。应使用应用明确的身份属性，并排除当前会话。删除旧会话或将其标记为撤销后，还要保证后续请求确实读取并执行这个状态。

## 并发登录需要统一决策

遍历 `getActiveSessions()` 可以用于小规模单实例管理，但它不是并发控制机制。两个请求同时扫描并踢出对方时，可能留下错误结果。多实例应维护用户与有效会话的集中索引，使用原子操作决定哪个会话有效，并处理过期、退出和缓存失效。

使用登录版本号也是一种思路：每次成功登录递增有效版本，请求携带的会话版本与当前版本不符则要求重新登录。具体实现要保证版本更新、状态读取和故障处理符合业务要求。

## 在线列表只是会话视图

SessionDAO 中存在记录不等于用户此刻在线。列表应过滤过期和撤销会话，按用户聚合，并说明“最近活跃”的时间窗口；不要直接向普通用户展示完整会话标识。

测试至少覆盖密码错误不踢人、连续登录替换、同时登录、主动退出和会话过期。最终标准是旧会话无法再访问受保护资源，而不只是管理页面少了一行。

参考：[Shiro Session Management](https://shiro.apache.org/session-management.html)。
