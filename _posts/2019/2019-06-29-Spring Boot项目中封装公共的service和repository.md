---
layout: post
category : java
keywords : "Spring Boot,公共service,公共repository,开源项目"
description: "后台项目经常重复编写增删改查与筛选分页代码。我在项目中尝试将公共能力放入 Repository 和 Service，但抽象的目标应该是减少真正稳定的重复，而不是让每个业务都继承一套不断膨胀的父类。"
tags : [SpringBoot,java]
lang: zh-CN
translation_key: spring-data-common-service-repository
---

后台项目经常重复编写增删改查与筛选分页代码。我在项目中尝试将公共能力放入 Repository 和 Service，但抽象的目标应该是减少真正稳定的重复，而不是让每个业务都继承一套不断膨胀的父类。
<!--break-->

{% include JB/setup %}

## 先复用 Spring Data 已有的接口

```java
@NoRepositoryBean
public interface BaseRepository<T, ID>
        extends JpaRepository<T, ID>, JpaSpecificationExecutor<T> {
}
```

`@NoRepositoryBean` 表示基础接口不直接创建实体仓库实例。具体仓库指定实体与主键类型：

```java
public interface UserRepository extends BaseRepository<User, Long> {
}
```

这里的增删改查、分页和 Specification 执行已经由 Spring Data 提供，不必再逐一包一层同名方法。只有确实要为所有仓库增加默认行为，才需要自定义基础实现；现代 Spring Data JPA 可通过 `repositoryBaseClass` 配置，复杂工厂扩展应与实际版本 API 对齐。

## 查询抽象要限制输入范围

通用筛选可以把受支持的字段、操作符和值转换成 Specification，再交给仓库执行。下面是在 Service 内构造条件的片段：

```java
Specification<User> condition = (root, query, cb) ->
        cb.equal(root.get("status"), status);
Page<User> result = userRepository.findAll(condition, pageable);
```

片段需要具体的 User 实体、status 值与 Pageable。字段和排序方向不能不加限制地从请求传入，应使用允许列表，并校验值类型、页大小与最大范围。参数绑定能避免把值拼接成 SQL，但不能代替字段授权与业务数据范围控制。

跨表关联还要验证重复记录与 count 查询。日期、数字、枚举先转换为明确类型，不能依赖一组 unchecked cast 恰好成功。空条件、空 IN 集合和 AND/OR 的组合也需要定义清楚。

## Service 应表达业务操作

业务服务负责权限、状态约束和事务边界。`save` 不会自动区分“合法新增”和“有权修改”：编辑前仍需查询并检查目标，避免客户端传入任意 ID 就覆盖记录。`getReferenceById` 一类方法返回的引用也不能直接当作存在性检查。

例如“冻结账户”应是明确的业务方法，而不是把整个请求对象传给通用 update。涉及多个仓库操作时，在业务边界声明事务；只读查询可以按需要使用只读事务。批量删除可能绕过实体回调，也不应该将全表清空作为通用业务接口暴露。

## 避免让分页对象承担所有职责

请求可以有自己的分页 DTO，内部优先使用 Spring Data 的 Pageable 与 Page，最后映射为接口响应。注意前端页码常从 1 开始，而 PageRequest 从 0 开始；总记录数使用 long，不要随意缩窄为 int。

抽象完成后，用不同实体验证新增、更新、空查询、越界页码、排序和事务回滚。若为了适配第二个实体就要不断增加特判，应考虑把差异留在业务层，而不是继续扩大父类。

参考：[Spring Data JPA 自定义仓库](https://docs.spring.io/spring-data/jpa/reference/repositories/custom-implementations.html)。
