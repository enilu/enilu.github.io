---
layout: post
category : 随手记
keywords: "spring,aop"
description :"使用Spring aop进行面向切面编程"
tags : [spring]
---

使用spring可以很方便的编写aop程序

<!--break-->

{% include JB/setup %}



maven依赖

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-aop</artifactId>
            <version>4.3.3.RELEASE</version>
        </dependency>
        <dependency>
            <groupId>org.aspectj</groupId>
            <artifactId>aspectjrt</artifactId>
            <version>1.7.3</version>
        </dependency>
        <dependency>
            <groupId>org.aspectj</groupId>
            <artifactId>aspectjweaver</artifactId>
            <version>1.7.3</version>
            <scope>runtime</scope>
        </dependency>

spring配置：

        <beans  xmlns:aop="http://www.springframework.org/schema/aop"
             xsi:schemaLocation="......
                      http://www.springframework.org/schema/aop
                      http://www.springframework.org/schema/aop/spring-aop.xsd
                      ......">
   <aop:aspectj-autoproxy />

定义切面类：

        import org.aspectj.lang.JoinPoint;
        import org.aspectj.lang.ProceedingJoinPoint;
        import org.aspectj.lang.annotation.After;
        import org.aspectj.lang.annotation.AfterReturning;
        import org.aspectj.lang.annotation.AfterThrowing;
        import org.aspectj.lang.annotation.Around;
        import org.aspectj.lang.annotation.Aspect;
        import org.aspectj.lang.annotation.Before;

        import org.springframework.stereotype.Component;



        @Aspect
        @Component
        public class HelloWordAspect {
            @Before(value="execution(* com.SpringAOP.HelloWord.HelloWord.*(..))")
            public void beforeSayHello(JoinPoint joinPoint){

                System.out.println("Before :"+joinPoint.getArgs()[0]);
            }

            @After(value="execution(public void com.SpringAOP.HelloWord.HelloWord.sayHello(..)) && args(message)")
            public void afterSayHello(String message){
                System.out.println("After : "+message);
            }

            @Around(value="execution(public void com.SpringAOP.HelloWord.HelloWord.sayHello(..))")
            public void aroundSayHello(ProceedingJoinPoint joinPoint) throws Throwable{
                System.out.println("Around Before !! ");
                joinPoint.proceed();
                System.out.println("Around After !! ");
            }

            @AfterThrowing(value="execution(public void com.SpringAOP.HelloWord.HelloWord.sayHello(..))",throwing="ex")
            public void afterThrowingSayHello(Exception ex){
                System.out.println("After Throwing : "+ex.getMessage());
            }

            @AfterReturning(value="execution(public void com.SpringAOP.HelloWord.HelloWord.sayHello(..))",returning="reval")
            public void afterReturningSayHello(String reval){
                System.out.println("After Returning : "+reval);
            }
        }


参考网址：

http://www.cnblogs.com/wushiqi54719880/archive/2011/08/09/2133048.html
http://shouce.jb51.net/spring/aop.html