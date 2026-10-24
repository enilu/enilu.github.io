---
layout: post
category : java
keywords : "Spring Boot,JpaAuditing,数据审计"
description: "业务数据常常需要记录创建时间、修改时间、创建人和修改人。Spring Data JPA 的审计功能可以自动维护这些字段，但需要同时配置实体监听器、审计基础设施以及当前操作者的来源。"
tags : [SpringBoot,java]
lang: zh-CN
translation_key: spring-data-jpa-auditing
---

业务数据常常需要记录创建时间、修改时间、创建人和修改人。Spring Data JPA 的审计功能可以自动维护这些字段，但需要同时配置实体监听器、审计基础设施以及当前操作者的来源。
<!--break-->

{% include JB/setup %}

## 给基础实体声明审计字段

下面以 Spring Boot 2.x 的 `javax.persistence` 为例。Spring Boot 3.x 使用 `jakarta.persistence`，Spring Data 的审计注解包名则仍是 `org.springframework.data.annotation`。

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

    // 按项目约定提供需要的访问方法。
}
```

`@MappedSuperclass` 让子实体继承映射，`AuditingEntityListener` 接收持久化生命周期事件。创建字段设置 `updatable=false`，是为了避免普通更新覆盖创建信息；数据库列类型和时区约定仍需与应用统一。

## 开启审计并提供操作者

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

这段配置使用 Spring 的 `@Configuration`、`@Bean`，以及 Spring Data 的 `AuditorAware`、`@EnableJpaAuditing`。`CurrentActor` 是应用自己定义并注册为 Bean 的身份上下文，例如：

```java
import java.util.Optional;

public interface CurrentActor {
    Optional<Long> id();
}
```

Web 请求中的身份应来自已经验证过的认证上下文，不应直接把客户端传来的用户 ID 当作操作者。定时任务则显式设置系统身份；匿名请求是否允许写入、没有身份时返回空值还是拒绝操作，都应由业务约定。

`Optional.ofNullable(id)` 适用于允许空身份的情况，不能在可能为 null 时调用 `Optional.of(id)`。也不要捕获所有异常后统一返回系统账户，否则认证或缓存故障会被伪装成正常系统操作。

## 自动填充的范围

这些字段在相应的 JPA 实体生命周期事件中处理，不是每次调用 `save` 就一定立刻执行一条 SQL。事务提交、flush 和脏检查共同决定实际写入时机。

批量 JPQL 更新、原生 SQL 和其他程序直接写库，可能绕过实体监听器；这类路径需要自己维护审计值。若业务需要完整变更历史，四个字段也不够，还需要独立的操作日志或历史记录机制。

可以用集成测试分别验证创建、更新、无身份和后台任务：创建信息是否保持、修改信息是否更新，以及数据库最终存储值是否符合约定。

参考：[Spring Data JPA Auditing](https://docs.spring.io/spring-data/jpa/reference/auditing.html)。
