---
layout: post
category : 开源项目
keywords: "guns-lite,spring boot"
description : "guns-lite,基于spring boot的后台管理系统"
tags : [guns,guns-lite,spring boot]
---


年初公司计划要上一个产品，而且是要在两周内上线（由于之前已经开发、运营过一个类似的产品，所以这次要求先将核心功能上线；当然最后没有那么快上线，这是后话）。
由于这个系统比较复杂，所以我们和以前一样计划将服务拆分，包括后台管理、微信端，api层，消息服务，调度任务等若干服务。领导既然发话了，无论计划看上去多么不靠谱，撸起袖子也得干。

<!--break-->

{% include JB/setup %}



技术方案决定使用spring boot 后，大家分工开始各自各干各的。

我很“荣幸”的分到后台管理等若干模块，开始干的时候我就想，两周时间写界面都不够。于是开始上网找轮子，有幸发现[guns](https://github.com/stylefeng/Guns)：一个基于spring boot的后台管理系统，而且具备代码生成功能。
但是这个项目有个不方便的地方：数据库访问层使用的是mybatis。由于其他服务已经开始开发，而且都是使用spring data jpa。如果我要用guns，就没办法和别人共用dao层，层连带的
service层也没办法共用了。想想以后要维护两套dao层和service层就吸了一口凉气——这是个金融系统，dao和service层仅仅靠自动生成的代码是远远不够的。


所以等项目过了两周后，不出预料项目要延期了（具体原因不仅仅是内部原因，还有外部投资人、客户对产品需求的变更等，这不是重点，暂且不表）。于是趁着延期的那段时间，
将后台管理的dao层适配为jpa，service也使用公共的service了。

改造期间，惊心动魄。因为产品人员几度表明“明天测试”或者“下周上线试运行”，导致同时维护两个后台管理，老版本继续在guns的基础上开发功能赶进度，新版本使用jpa和新的service不停的追赶老版本。

持续了将近两周的时间，终于新版本追上了，老版本果断丢弃。

想到也许有同样需求的开发同学，或者不喜欢mybatis的同学，或者由于种种原因不方便使用mybatis，就将其贡献出来，也就是这个[guns-lite](https://github.com/enilu/guns-lite):
[https://github.com/enilu/guns-lite](https://github.com/enilu/guns-lite).



## 说明

 - guns-lite是在[guns](https://github.com/stylefeng/Guns)的基础上将数据库层由mybatis替换为spring data jpa的系统。
 - guns-lite是一个基于spring boot的后台管理系统。

## 技术选型

- 核心框架：spring boot
- 数据库层：spring data jpa
- 安全框架：Shiro
- 数据库连接池：Druid
- 缓存：Ehcache
- 前端：Beetl模版+Bootstrap

## 交流
- 欢迎提issue [https://github.com/enilu/guns-lite/issues/new](https://github.com/enilu/guns-lite/issues/new)
- 欢迎加入qq交流群：740230743
