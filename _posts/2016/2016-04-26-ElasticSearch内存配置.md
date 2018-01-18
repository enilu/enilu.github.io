---
layout: post
category : elasticsearch 
keywords : "开源,搜索,elasticsearch,大数据,问题"
description : "elasticsearch堆内存溢出解决"
tags : [开源,搜索,elasticsearch,大数据]
---

最近生产环境的es经常不稳定，用了一两天就开始报错，而测试环境的没有问题；甚是纳闷。看了错误日志如下：

    org.elasticsearch.search.query.QueryPhaseExecutionException: [credit][2]: query[filtered(_all:北 _all:京)->cache(_type:entname)],from[12700000],size[100000]: Query Failed [Failed to execute main query]
    	at org.elasticsearch.search.query.QueryPhase.execute(QueryPhase.java:163)
    	at org.elasticsearch.search.SearchService.loadOrExecuteQueryPhase(SearchService.java:272)
    	at org.elasticsearch.search.SearchService.executeQueryPhase(SearchService.java:283)
    	at org.elasticsearch.search.action.SearchServiceTransportAction$5.call(SearchServiceTransportAction.java:231)
    	at org.elasticsearch.search.action.SearchServiceTransportAction$5.call(SearchServiceTransportAction.java:228)
    	at org.elasticsearch.search.action.SearchServiceTransportAction$23.run(SearchServiceTransportAction.java:559)
    	at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1145)
    	at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:615)
    	at java.lang.Thread.run(Thread.java:745)
    Caused by: java.lang.OutOfMemoryError: Java heap space
    
刚开始以为是查询写的有问题，导致内存溢出呢。但是自己看了写日志产生日期，感觉不对劲啊，这个日志一直报着，而且大半夜也听不下来。    
<!--break-->

{% include JB/setup %}

后来查了以下，原来是队内存配置过低了，参考资料[戳这里](https://github.com/elastic/elasticsearch/issues/2636)

es启动的时候直接从环境变量读取内存配置：

    export ES_HEAP_SIZE=内存大小。
    
具体应该配置多大，可以查看当前es的内存使用情况。如果es已经停止掉，可以先设置稍微大一些的内存，观察一段时间。
查看内存使用情况可以直接通过下面连接：

    http://localhost:9200/_nodes/stats?jvm=true&pretty=true
    
可以看到类似下面的配置：

    "jvm" : {
            "timestamp" : 1461650503911,
            "uptime_in_millis" : 15781046,
            "mem" : {
              "heap_used_in_bytes" : 124822216, //当前使用的内存字节数
              "heap_used_percent" : 11, //当前内存使用百分比
              "heap_committed_in_bytes" : 1065025536, 
              "heap_max_in_bytes" : 1065025536,//当前分配的内存总大小
              ...
                }
            ...
            }
    ...
    }


**注意:**

有的地方会该处查看内存情况的地址：http://localhost:9200/_cluster/nodes/stats?jvm=true&pretty=true，这个地址是1.3以上的版本地址，1.4以后已经更改为：
   http://localhost:9200/_nodes/stats?jvm=true&pretty=true


### 参考资料：

- [https://groups.google.com/forum/?fromgroups=#!topic/elasticsearch/mrnnOc0TEoE](https://groups.google.com/forum/?fromgroups=#!topic/elasticsearch/mrnnOc0TEoE)
- [https://github.com/elastic/elasticsearch/issues/2636](https://github.com/elastic/elasticsearch/issues/2636)
