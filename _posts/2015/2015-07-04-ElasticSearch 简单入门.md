---
layout: post
category : 搜索 
keywords : "开源,搜索,elasticsearch,大数据,入门教程,elasticsearch简单入门"
description : "ElasticSearch是一个开源的分布式搜索引擎，具备高可靠性，支持非常多的企业级搜索用例。像Solr4一样，是基于Lucene构建的。支持时间时间索引和全文检索。官网：http://www.elasticsearch.org"
tags : [开源,搜索,elasticsearch,大数据,入门教程]
---

ElasticSearch是一个开源的分布式搜索引擎，具备高可靠性，支持非常多的企业级搜索用例。像Solr4一样，是基于Lucene构建的。支持时间时间索引和全文检索。官网：http://www.elasticsearch.org
<!--break-->

{% include JB/setup %}


它对外提供一系列基于java和http的api，用于索引、检索、修改大多数配置。

写这篇博客的的主要原因是ElasticSearch的网站只有一些简单的介绍，质量不高，缺少完整的教程。我费了好大劲才把它启动起来，做了一些比hello world更复杂一些的工作。我希望通过分享我的一些经验来帮助对ElasticSearch（很强大的哦）感兴趣的人在初次使用它的时候能够节省些时间。学完这篇教程，你就掌握了它的基本操作——启动、运行。我将从我的电脑上分享这个链接。

这么着就开始了。

    作者假设读者拥有安装后的Java。

    下载来自http://www.elasticsearch.org/download/的ElasticSearch。再一次，关于在Linux与其他非视窗系统环境里操作它的谈论有许多，但是作者更加关心着视窗7版桌面环境。请对应选择安装包裹。对视窗系统 - 一Zip文件 - 用户可解压缩到C:\elasticsearch-0.90.3\. 牢记，这十分的不同于安装Eclipse IDE。

    作者不熟悉curl跟cygwin，而且作者打算节省掌握时间（此多数在官网ElasticSearch.org应用的命令面对非视窗平台）(译者：大可以安装一虚拟机、便携版Linux或者MinGW)。读者可以在http://curl.haxx.se/download.html和http://cygwin.com/install.html安装Curl和cygwin。

于是测试下目前作者和读者所做到的。

    视窗7版桌面环境，运行命令行，进入 cd C:\elasticsearch-0.90.3\bin 目录。

    这时运行 elasticsearch.bat

    上面在本机启动了一个ElasticSearch节点。 读者会看到下面的记录提示。
    ![图1](http://img.blog.csdn.net/20150407233736504?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvbW9veWlubg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)
    
（如果您家情况明显不一样，请读者们不要忧愁，因那作者有些个Elastic Search的插件程序，而且作者家节点命名和其它会不同读者家的）

4. 现在在浏览器里测试一下
![图1](http://img.blog.csdn.net/20150407233925607?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvbW9veWlubg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)
如果你得到的status是200那它意味着所有的事情都ok啦...是不是很简单？

让我们看看JSON的每个字段代表的含义：

Ok:当为true时，意味着请求成功。

Status:发出请求后的HTTP的错误代码。200表示一切正常。

Name:我们Elasticsearch实例的名字。在默认情况下，它将从一个巨长的名字列表中随机选择一个。

Version:这个对象有一个number字段，代表了当前运行的Elasticsearch版本号，和一个Snapshot_build字段，代表了你当前运行的版本是否是从源代码构建而来。

Tagline:包含了Elasticsearch的第一个tagline: "You Know, for Search."

5. 现在让我们从http://mobz.github.io/elasticsearch-head/安装ElasticSearch Head插件

安装方法非常简单


1
2
	
cdC:\elasticsearch-0.90.3\bin
plugin -installmobz/elasticsearch-head


上面的命令会把 elasticsearch-head插件装到你的环境里
教程样例

我们将要部署一个非常简单的应用--在一个部门里的雇员--这样我们可以把注意力放在功能而不是氧立得复杂性上。总而言之，这篇博文是为了帮助人们开始ElasticSearch入门。

1)现在打开你的cygwin窗口并且键入命令
	
    curl -XPUT 'http://localhost:9200/dept/employee/32'-d '{ "empname": "emp32"}'

dept是一个索引并且索引类型是雇员，此时我们正在输入这个索引类型的第31个id。

你应该能在cygwin的窗口看到这样的信息：

让我们看一下这个输出：
        
    ========================================================================
    % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
    Dload  Upload   Total   Spent    Left  Speed
    100    91  100    70  100    21    448    134 --:--:-- --:--:-- --:--:--   500{"ok":true,"_index":"dept","_type":"employee","_id":"31","_version":1}
    ========================================================================

和上面的命令一样--让我们输入更多的记录：

	
    curl -XPUT 'http://localhost:9200/dept/employee/1'-d '{ "empname": "emp1"}'
    curl -XPUT 'http://localhost:9200/dept/employee/2'-d '{ "empname": "emp2"}'
    ...
    ...
    curl -XPUT 'http://localhost:9200/dept/employee/30'-d '{ "empname": "emp30"}'

注意：你要记得增加索引计数器和大括号里empname的值。

一旦这些工作都完成了--你为ElasticSearch输入了足够多的数据，你就可以开始使用head插件搜索你的数据了。

让我们试试吧！

在浏览器中输入：

    http://localhost:9200/_plugin/head/

你会看到这个：
![图1](http://img.blog.csdn.net/20150407233928450?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvbW9veWlubg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)
这里是有关簇使用情况和不同索引信息的概况。我们最近创建的索引在其中，显示为"dept"。

现在点击Structured Query选项卡
![图1](http://img.blog.csdn.net/20150407234041844?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvbW9veWlubg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)
在Search下来菜单中选择"dept"并点击"Search"按钮。

这将显示所有记录。

搜索特定条目

让我们来搜索emp1，emp25和emp7。不断点击最右面的"+"来添加更多的搜索项，就像如图显示的那样，之后点击"Search"。确保最左边的选项为"should"，其他的选项也应该和图中的保持一致。

现在你可以继续尝试这个插件了，你可以将其用到你的搜索项目中。

你可以尝试在我的桌面电脑上运行的该应用：

    http://localhost:9200/_plugin/head/

