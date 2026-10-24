---
layout: post
category : java
keywords : "Spring Boot,Validator,数据校验,开源项目"
description: "前端校验用于及时提示用户，后端校验用于保证进入业务的数据满足约束。即使网页已经检查过必填项，接口仍可能被其他客户端直接调用，因此后端不能省略验证。"
tags : [SpringBoot,java]
lang: zh-CN
translation_key: spring-boot-request-validation
---

前端校验用于及时提示用户，后端校验用于保证进入业务的数据满足约束。即使网页已经检查过必填项，接口仍可能被其他客户端直接调用，因此后端不能省略验证。
<!--break-->

{% include JB/setup %}

## 配好校验依赖，再约束请求对象

Hibernate Validator 是 Bean Validation 的实现，与用于持久化的 Hibernate ORM 不是同一职责。Spring Boot 也不要求所有项目使用 Hibernate 持久化。可以显式引入校验 starter，由项目使用的 Spring Boot 版本管理依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

下面采用 Spring Boot 2.x 的 `javax.validation` 包名；Spring Boot 3.x 使用 `jakarta.validation`，不要将两套注解混用。

```java
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class MessageRequest {
    @NotBlank(message = "编号不能为空")
    @Size(max = 32, message = "编号不能超过32个字符")
    private String code;

    @NotBlank(message = "内容不能为空")
    private String content;

    @NotNull(message = "发送者不能为空")
    private Long idMessageSender;

    // 省略 getter/setter；实际请求绑定时需提供。
}
```

使用请求 DTO 能避免客户端修改实体里的审计字段或其他不应开放的属性。校验注解不会自动形成数据库唯一约束，编号是否唯一、用户是否能使用指定发送者，还需要业务和数据库共同保证。

## 在请求入口触发校验

```java
@PostMapping("/messages")
public ResponseEntity<?> save(@Valid @RequestBody MessageRequest request,
                              BindingResult errors) {
    if (errors.hasErrors()) {
        List<String> messages = errors.getFieldErrors().stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .collect(Collectors.toList());
        return ResponseEntity.badRequest().body(messages);
    }
    // 此处执行权限检查与业务处理。
    return ResponseEntity.ok().build();
}
```

这里是 Controller 中的方法片段，使用 Spring MVC 的 `ResponseEntity`、`BindingResult` 与 JDK 的 `List`、`Collectors`。`BindingResult` 紧跟被校验的参数；也可以不接收它，由统一异常处理器返回错误结构。JSON 请求使用 `@RequestBody`，表单绑定则使用 `@ModelAttribute`，两者按请求格式选择。

## 约束的边界

| 注解 | 含义 | 常见误用 |
|---|---|---|
| `@NotNull` | 值不能为 null | 不检查字符串是否为空 |
| `@NotBlank` | 字符序列非 null，且至少有一个非空白字符 | 不能用于 Long 等数字类型 |
| `@NotEmpty` | 支持的字符串、集合、数组等非 null 且非空 | 空白字符串仍可能通过 |
| `@Size` | 支持的值的长度或元素数满足范围 | 不能代替数字大小校验 |
| `@Min` / `@Max` | 数字满足上下界 | 通常允许 null，必填需另加约束 |
| `@Email` | 检查邮箱形式 | 不证明邮箱存在或属于当前用户 |

嵌套请求对象需要在关联属性上使用 `@Valid` 触发级联校验。新增与编辑的约束不同时，可通过分组配合 `@Validated` 选择规则；不要让所有接口都被迫使用同一组必填字段。

最后应验证空值、空白、长度边界、类型不匹配和嵌套对象的情况，确认失败请求确实不会进入保存流程。规则是否生效，要通过入口调用来验证，不能只看实体上有没有注解。

参考：[Spring Boot Validation](https://docs.spring.io/spring-boot/reference/io/validation.html)、[Hibernate Validator](https://hibernate.org/validator/documentation/)。
