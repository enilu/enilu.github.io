---
layout: post
category : java
keywords: "spring,aop"
description: "Spring AOP 适合把日志、耗时统计等横切逻辑放到业务方法之外。关键是知道切面拦截哪个方法、何时执行，以及如何保留原方法的返回值和异常。"
tags : [开源]
lang: zh-CN
translation_key: spring-aop-basics
---

Spring AOP 适合把日志、耗时统计等横切逻辑放到业务方法之外。关键是知道切面拦截哪个方法、何时执行，以及如何保留原方法的返回值和异常。
<!--break-->

{% include JB/setup %}

## 一个记录耗时的切面

项目引入与 Spring 版本匹配的 AOP 依赖。Spring Boot 可以使用 spring-boot-starter-aop；普通 Spring 应开启相应自动代理配置，并让切面被组件扫描。

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

切点包名按项目替换。proceed 执行业务方法，返回值原样传回；finally 在正常返回或异常退出时都会执行。实际系统应使用合适日志，避免输出全部参数。

## 通知类型表达不同时间点

Before 在调用前执行；AfterReturning 只处理正常返回；AfterThrowing 处理异常；After 类似 finally；Around 控制整个调用。void 方法没有可绑定的正常返回值，不能强行用 String 参数接收。

通常应保留异常继续向上传播，不捕获后返回 null 假装成功，也不在语义不明时多次调用 proceed。

## 代理边界决定哪些调用生效

Spring AOP 通常依赖代理。对象内部通过 this 调用另一个方法，往往不会再次经过代理；自己 new 出的对象也不会因为注解就自动被拦截。final、private 方法与接口代理或类代理各有限制。

从 Spring 容器取得 Bean，通过外部调用验证正常和异常路径。直接调用切面方法，不能证明业务调用真正经过代理。

参考：[Spring AOP](https://docs.spring.io/spring-framework/reference/core/aop.html)。
