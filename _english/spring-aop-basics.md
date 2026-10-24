---
source_sha256: 27490f4d3b6da45f8f0f39334198c158282b2decb8b2c6278089d0667d78fa7c
title: A Practical Introduction to Spring AOP
date: '2017-01-21'
lang: en
translation_key: spring-aop-basics
permalink: /en/2017/01/21/spring-aop-basics/
description: Spring AOP moves cross-cutting behavior such as logging and timing outside business methods. The essentials are which methods are intercepted, when advice executes, and how original return values and exceptions are preserved.
---

Spring AOP moves cross-cutting behavior such as logging and timing outside business methods. The essentials are which methods are intercepted, when advice executes, and how original return values and exceptions are preserved.
<!--break-->

## A timing aspect

Include AOP dependencies compatible with Spring. Spring Boot can use spring-boot-starter-aop; a plain Spring application needs the appropriate automatic proxy configuration and component scanning for the aspect.

```java
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class TimingAspect {
    @Around("execution(public * com.example.service..*(..))")
    public Object measure(ProceedingJoinPoint point) throws Throwable {
        long start = System.nanoTime();
        try {
            return point.proceed();
        } finally {
            System.out.println(point.getSignature() + ": "
                    + (System.nanoTime() - start) + " ns");
        }
    }
}
```

Replace the pointcut package with the actual project package. proceed executes the business method and its result is returned unchanged. finally runs on both successful and exceptional exits. Use appropriate application logging and avoid printing every argument.

## Advice types represent different execution points

Before runs before invocation; AfterReturning handles normal returns; AfterThrowing handles exceptions; After behaves like finally; Around controls the invocation as a whole. A void method has no normal value to bind to a String parameter.

Normally, preserve exceptions and let them propagate. Do not catch a failure and return null as apparent success, or invoke proceed repeatedly without clear semantics.

## Proxy boundaries determine interception

Spring AOP normally relies on proxies. A method calling another through this generally does not pass through the proxy again. An object created with new is not automatically intercepted because of annotations. final and private methods, interface proxies and class proxies have different limitations.

Obtain the bean from Spring and test external calls through both successful and exceptional paths. Calling an advice method directly does not establish that business calls pass through the proxy.

**References**

- [Spring AOP](https://docs.spring.io/spring-framework/reference/core/aop.html)
