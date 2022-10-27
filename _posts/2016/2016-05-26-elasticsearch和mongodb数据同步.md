---
layout: post
category : 大数据 
keywords : "开源,搜索,elasticsearch,大数据,mongodb,mongodb-connector"
description : "公司产品部门最近出了个新需求，希望能将公司各种来源的数据根据企业唯一标识合并到一个大库中。理了一下具体需求，主要目标有两个"
tags : [开源,搜索,elasticsearch,大数据,mongodb]
---

公司产品部门最近出了个新需求，希望能将公司各种来源的数据根据企业唯一标识合并到一个大库中。理了一下具体需求，主要目标有两个：
- 第一 总记录在3000万条（基本上）主流企业的数量，
- 第二 该库要能方便的通过各种维度查询，统计，分析。
想了两天，并且开会讨论后决定使用mongodb加elasticsearch的方式：
- mongodb负责数据存储。
- elasticsearch负责建索引。
于是查了各种资料，暂时决定，mongodb保存记录的时候，通过一些同步工具自动将记录在es中建立索引。
环境搭建工作分三步：
- 搭建es集群环境（这个环境公司已经有了，所以不用做这方面工作）
- 搭建mongodb集群环境
- 通过一些外部工具将mongodb数据同步到es中，看中了两个工具，一个是elasticsearch-river-mongodb，一个是Mongodb Connector


<!--break-->

{% include JB/setup %}


## es集群搭建

参考之前的一篇文章 

[ElasticSearch 简单入门](../015-07-04-ElasticSearch 简单入门.md) 

##  MongoDB 副本集replSet 配置
mongodb集群搭建网上很多资料，这里简单说下，我的步骤
### 下载解压

官网下载，我用的是：mongodb-3.2.4.tar
分别解压到三台主机上，我用的都是centos虚拟机。
我解压的目录都为/opt/mongodb-3.2.4
然后建立mongo的工作目录，三台机器都建立在/opt/mongo
### keyfile生成

在一台机器上生成keyfile，并赋予600权限，分别拷贝到三台mongodb的工作目录中：
 
     openssl rand -base64 741 >key
     chmod 600 key
### 建立数据目录

 三台机器都建立数据目录/opt/mongo/db
 

### 新建配置文件

配置文件放在/opt/mongodb-3.2.4/mongod.conf
内容为：

    #数据库文件夹所在位置，注意，要提前建好下面这个文件夹
    dbpath=/opt/mongo/db
    #日志所在位置，提前建立好/opt/mongo文件夹
    logpath=/opt/mongo/mongod.log
    #pid所在位置（默认）
    pidfilepath = /opt/mongo/mongod.pid
    #keyFile所在位置，生成方式见本文当后面部分
    keyFile=/opt/mongo/key
    
    #端口（默认）
    port=27017
    
    #每次启动后日志追加在后面，不会新建日志文件（默认）
    logappend=true
    #用deamon方式启动（添加）
    fork=true
    #打开操作日志，用于故障恢复和持久化（默认）
    journal=true
    #replica set的名字（添加）
    replSet=test-set

保证三台服务器配置一模一样

### 初始化


### 启动测试



## elasticsearch-river-mongodb

刚开始打算使用这个es插件做数据同步的，这个插件的版本和es以及mongodb对应比较紧密，在官方的github总没有找到我对应的版本
我的版本分别是es:1.4.4,mongodb:3.2.4,官方给的最接近的插件版本是2.0.9，分别对应es:1.4.2,mongodb:3.0.0
于是安装了2.0.9，但是总是不成共，最后无意看到一篇文章发现这个插件已经停止更新了。[https://www.elastic.co/blog/deprecating-rivers](https://www.elastic.co/blog/deprecating-rivers)
就此打住。

## mongodb-connector




