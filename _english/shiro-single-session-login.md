---
source_sha256: 04c5559cecb82cc092dbe337216c436aa49a083151cd6d8153632bafebee0849
title: Replacing Previous Login Sessions with Apache Shiro
date: '2014-07-28'
lang: en
translation_key: shiro-single-session-login
permalink: /en/2014/07/28/shiro-single-session-login/
description: 'A single-session-per-account requirement first needs a conflict policy: replace the previous login or reject the new one. This article discusses replacement, distinguishing session enumeration in one process from coordinated control across '
---

A single-session-per-account requirement first needs a conflict policy: replace the previous login or reject the new one. This article discusses replacement, distinguishing session enumeration in one process from coordinated control across multiple instances.
<!--break-->

## Connect the appropriate SessionDAO

This single-instance fragment uses Shiro's native Web Session and belongs in an existing Spring beans configuration:

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

MemorySessionDAO stores sessions only in the current process. They disappear on restart and are not automatically shared across nodes. Systems using Servlet container sessions or stateless tokens need an implementation suited to their authentication model, rather than a copied configuration.

## Authenticate before replacing old sessions

Do not evict a session before verifying the new password. Otherwise, someone who merely knows a username can disrupt its owner through failed login attempts. Authenticate first, obtain a stable user ID and the new session ID, and then locate other sessions for that user.

A session principal is often a PrincipalCollection or custom object. Comparing its entire `toString()` output with a username is unreliable. Use an explicit identity property and exclude the current session. After deleting or revoking older sessions, ensure subsequent requests actually enforce the change.

## Concurrent logins need a shared decision

Enumerating `getActiveSessions()` can serve small single-instance administration, but is not a concurrency-control mechanism. Simultaneous requests can each find and evict the other session. With several instances, maintain a centralized user-to-valid-session index, decide validity atomically, and handle expiry, logout and cache invalidation.

A login version is another option. Increment the effective version after each successful login; requests with a different session version must authenticate again. Updates, reads and failure behavior still have to satisfy business requirements.

## An online list is a session view

A SessionDAO record does not prove that a person is currently online. Exclude expired and revoked sessions, group by user, and define a recent-activity window. Do not expose complete session identifiers to ordinary users.

Test failed passwords without eviction, sequential replacement, concurrent login, logout and expiry. The acceptance criterion is that the old session cannot access protected resources, rather than merely disappearing from an administration table.

**References**

- [Shiro Session Management](https://shiro.apache.org/session-management.html)
