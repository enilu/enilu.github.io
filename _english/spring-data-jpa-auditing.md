---
source_sha256: 140ba056c67a14fab86e96d09f600fdde7c74b4129454920cb0682ce4eed3ce0
title: Tracking Creation and Modification with JPA Auditing
date: '2019-05-29'
lang: en
translation_key: spring-data-jpa-auditing
permalink: /en/2019/05/29/spring-data-jpa-auditing/
description: 'Business records often need creation and modification timestamps and the identities of their creators and editors. Spring Data JPA auditing can maintain these fields automatically, provided entity listeners, auditing infrastructure and the '
---

Business records often need creation and modification timestamps and the identities of their creators and editors. Spring Data JPA auditing can maintain these fields automatically, provided entity listeners, auditing infrastructure and the current actor source are configured together.
<!--break-->

## Declare auditing fields on a base entity

This example uses Spring Boot 2.x `javax.persistence`. Boot 3.x uses `jakarta.persistence`, while Spring Data auditing annotations remain under `org.springframework.data.annotation`.

```java
import java.time.Instant;
import javax.persistence.*;
import org.springframework.data.annotation.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {
    @Id
    @GeneratedValue
    private Long id;

    @CreatedDate
    @Column(updatable = false)
    private Instant createTime;

    @CreatedBy
    @Column(updatable = false)
    private Long createBy;

    @LastModifiedDate
    private Instant modifyTime;

    @LastModifiedBy
    private Long modifyBy;

    // Provide the accessors required by the project.
}
```

`@MappedSuperclass` lets entities inherit mappings. `AuditingEntityListener` receives persistence lifecycle events. Mark creation fields `updatable=false` to prevent ordinary updates from overwriting them. Application and database column types and timezone conventions still need to agree.

## Enable auditing and provide the actor

```java
@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
public class AuditConfig {
    @Bean
    public AuditorAware<Long> auditorProvider(CurrentActor currentActor) {
        return currentActor::id;
    }
}
```

This configuration uses Spring `@Configuration` and `@Bean`, together with Spring Data `AuditorAware` and `@EnableJpaAuditing`. `CurrentActor` is an application-defined identity context registered as a bean, for example:

```java
import java.util.Optional;

public interface CurrentActor {
    Optional<Long> id();
}
```

A web request's identity should come from an authenticated context, not a user ID supplied by the client. Scheduled work should explicitly establish a system identity. The business must decide whether anonymous writes are permitted and whether missing identity means an empty value or rejection.

Use `Optional.ofNullable(id)` when a missing identity is allowed, never `Optional.of(id)` if it may be null. Avoid catching every exception and returning a system account: that would disguise authentication or cache failures as legitimate system activity.

## Know where automatic population applies

Auditing is performed during the relevant JPA entity lifecycle events. Calling `save` does not necessarily execute SQL immediately. Transactions, flushing and dirty checking determine actual write timing.

Bulk JPQL updates, native SQL and other programs writing directly to the database may bypass entity listeners; those paths must maintain auditing values themselves. Four fields also do not constitute a complete change history. That requires separate operation logs or historical records.

Integration tests should cover creation, updates, missing identity and background jobs. Check that creation information is preserved, modification information changes, and the final database values match the convention.

**References**

- [Spring Data JPA Auditing](https://docs.spring.io/spring-data/jpa/reference/auditing.html)
