---
layout: post
category : 入门教程 
keywords : "kettle,开源,数据清洗,入门教程,spoon"
description : "项目中有数据清洗的需求，自己对sql中的函数，存储过程，不是太熟悉，就使用kettle进行处理"
tags : [kettle,开源,数据清洗,入门教程]
---

 项目中有数据清洗的需求，自己对sql中的函数，存储过程，不是太熟悉，就使用kettle进行处理，
 
<!--break-->

{% include JB/setup %}
 

**kettle 官网：**http://community.pentaho.com/projects/data-integration/
本例子实用5.3，版本和5.4差别不大
spoon入门：
	是kettle中的转换工具，提供gui。

**kettle安装包**，下载后，解压即可。依赖于jdk，保证机器上已经安装jdk
解压后的目录；D:\Program\pdi-ce-5.3.0.0-213\data-integration

## 启动spoon： ##

一个简单的例子，将一个csv文件中的姓名提取出来 存放到另外一个xml文件中
首先，建立这个csv测试文件

## 新建一个“转换” ##

上面的要求分解为三个步骤：

- 加载csv文件
- 进行转换：转换要求：我们将name前面加上hello: 我们使用js脚本进行转换
- 输出到xml文件

将以上三个步骤连接起来

连接的时候，选择连接线的源步骤，摁住shift建，拖动鼠标到目标步骤，松开鼠标即可，松开后，选择“主输出步骤”

接下来：设置每个步骤的具体细节：
大功告成