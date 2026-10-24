---
source_sha256: ba22898d2fc33800c6af8f619d578a8bce22897cae25aaa333ff8203fe631e6a
title: Validating Requests in Spring Boot
date: '2019-08-01'
lang: en
translation_key: spring-boot-request-validation
permalink: /en/2019/08/01/spring-boot-request-validation/
description: Frontend validation gives users prompt feedback; backend validation enforces the constraints on data entering the application. A checked web form does not prevent another client from calling the API directly, so server-side validation remai
---

Frontend validation gives users prompt feedback; backend validation enforces the constraints on data entering the application. A checked web form does not prevent another client from calling the API directly, so server-side validation remains necessary.
<!--break-->

## Configure validation and constrain request objects

Hibernate Validator implements Bean Validation. Its responsibility differs from Hibernate ORM persistence, and Spring Boot does not require every application to use Hibernate for persistence. Explicitly include the validation starter and let the project's Spring Boot version manage the dependency:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

This example uses Spring Boot 2.x `javax.validation` packages. Spring Boot 3.x uses `jakarta.validation`; do not mix the annotation families.

```java
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class MessageRequest {
    @NotBlank(message = "Code must not be blank")
    @Size(max = 32, message = "Code must not exceed 32 characters")
    private String code;

    @NotBlank(message = "Content must not be blank")
    private String content;

    @NotNull(message = "Sender must not be null")
    private Long idMessageSender;

    // Getters/setters omitted; provide them for request binding.
}
```

A request DTO prevents clients from modifying auditing fields or other entity properties that should remain private. Validation annotations do not automatically create database uniqueness constraints. Code uniqueness and permission to use a sender require business checks and database guarantees.

## Trigger validation at the request boundary

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
    // Perform authorization checks and business processing here.
    return ResponseEntity.ok().build();
}
```

This Controller fragment uses Spring MVC `ResponseEntity` and `BindingResult`, plus JDK `List` and `Collectors`. Place `BindingResult` immediately after the validated parameter. Alternatively, omit it and return structured errors through a shared exception handler. Use `@RequestBody` for JSON and `@ModelAttribute` for form binding, according to the request format.

## Understand constraint boundaries

| Annotation | Meaning | Common mistake |
|---|---|---|
| `@NotNull` | Value cannot be null | Does not reject empty strings |
| `@NotBlank` | A non-null character sequence with a non-whitespace character | Cannot annotate numeric types such as Long |
| `@NotEmpty` | Supported strings, collections or arrays are non-null and non-empty | Whitespace strings may still pass |
| `@Size` | Length or element count is within a range | Does not validate numeric magnitude |
| `@Min` / `@Max` | Numeric lower and upper bounds | Usually allow null; add a required-value constraint separately |
| `@Email` | Checks email syntax | Does not prove existence or ownership |

Use `@Valid` on nested request properties to trigger cascading validation. If creation and editing have different requirements, select groups with `@Validated` instead of forcing every endpoint to share the same required fields.

Test nulls, whitespace, length boundaries, type mismatches and nested objects. Verify that failed requests never reach persistence. Calling the entry point establishes whether rules work; seeing annotations on a class does not.

**References**

- [Spring Boot Validation](https://docs.spring.io/spring-boot/reference/io/validation.html)
- [Hibernate Validator](https://hibernate.org/validator/documentation/)
