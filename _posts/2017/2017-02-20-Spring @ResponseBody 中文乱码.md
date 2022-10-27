---
layout: post
category : java
keywords: "spring,springmvc中文乱码"
description : "spring @ResponseBody返回中文乱码问题"
tags : [学习笔记]
---

前端页面使用ajax请求后台，后台使用SpringMVC接收请求，发现action返回中文的时候总是乱码。


<!--break-->

{% include JB/setup %}

查了资料，发现
@ResponseBody 返回对象和返回字符串使用了不同的转换器，返回String字符串的时候，会使用org.springframework.http.converter.StringHttpMessageConverter进行输出，输出的时候，默认使用编码为：ISO-8859-1,部分源代码如下：


    public class StringHttpMessageConverter extends AbstractHttpMessageConverter<String> {
        public static final Charset DEFAULT_CHARSET = Charset.forName("ISO-8859-1");
        private final List<Charset> availableCharsets;
        private boolean writeAcceptCharset;

        public StringHttpMessageConverter() {
            this(DEFAULT_CHARSET);
        }
        ......
    }

如果一定要返回字符串几种方案：
- return new String("你好".getBytes(), "ISO-8859-1");
- 给@RequestMapping注解，配置produces的值

        @RequestMapping(value = "/add", produces = {"application/json;charset=UTF-8"})
- 第三种方案是通过集成StringHttpMessageConverter重写字符串的转换器，具体写法参考这里http://josh-persistence.iteye.com/blog/2085015（ps:我自己测试了下，没有成功，谁有心可以测试一下，上面两种方式我都没有测试，因为我喜欢用下面的方法）。

如果没有特殊要求，建议在使用@ResponseBody的时候直接返回对象即可，SpringMVC会自动将对象转换为字符串。其他什么多余的配置也不用做


**参考网址：**

- http://josh-persistence.iteye.com/blog/2085015
- http://fableking.iteye.com/blog/1577274
