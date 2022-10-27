---
layout: post
category : 数据库
keywords : "mysql,java"
description : "升级mysql驱动后导致的异常SQLException:validateconnection false"
tags : [java,mysql]
---

最新客户在扫描服务器漏洞，要求升级mysql的java驱动包，没想到升级后报错： java.sql.SQLException: validateConnection false。
<!--break-->

{% include JB/setup %}

我的驱动包是从5.1.24升级到8.0.28，如下：
```xml
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <!-- <version>5.1.24</version>-->
            <version>8.0.28</version>
        </dependency>
```
查了下原因，发现是mysql驱动包和druid版本不一致导致的。
刚开始不知道怎么找到合适的对应druid版本，就一个一个测试，后来发现在mvnrepository.com网站可以直接查看版本对应关系。
比如我最终使用的是druid1.2.12版本，搜索druid点击对应版本进入后，可以看到“Provided Dependencies (36)"下对应的mysql驱动包版本为：8.0.21至8.0.31：
![druid-mysql.png]({{ site.img_url }}/2022/druid-mysql.png)

我的mysql驱动版本为8.0.28在上述区间，这样就没有问题了。