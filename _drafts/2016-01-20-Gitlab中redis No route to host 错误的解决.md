---
layout: post
category : 问题集锦 
keywords : "gitlab,redis,linux"
description : ""
tags : [gitlab,redis,linux]
---

公司的测试服务器（centos）做安全加固，折腾完后，gitlab代码版本管理系统用不了了，界面一直报500错误，通过，端口，进程，数据库配置都没有问题，诡异了。

<!--break-->

{% include JB/setup %}


后来查看gitlab日志，发现下面错误：

![gitlab错误]({{ site.img_url }}/2016/gitlab.png)

哟，好像是redis有问题了哦
redis的.conf文件中如果有
1
	
bind 127.0.0.1

那么它就会被配置为仅接受本地的请求，这个是早就知道的，所以在此之前已经设置为

    # If you want you can bind a single interface, if the bind option is not
    # specified all the interfaces will listen for incoming connections.
    #
    # bind 127.0.0.1
    bind 0.0.0.0

然后查看redis进程，查看端口占用没有问题。

但是通过redis-cli连接redis的时候出事故了：

    [ops@devmgr ~]$ redis-cli
    Could not connect to Redis at 127.0.0.1:6379: No route to host
    not connected> 
然后设置telnet本机6379端口，果然也是不通。
有点晕了，防火墙是开着的没错，但是一般来说，访问本机一般不会有端口限制嘛。
试下关掉防火墙，果然好了，
那么只好添加防火墙规则，将6379开通：

    iptables -A INPUT -p tcp --dport 6379 -j ACCEPT
    iptables -A OUTPUT -p tcp --dport 6379 -j ACCEPT
    
    
然后,竟然还是不行！！！，原因是防火墙规则被其他规则覆盖了。那么把INPUT规则添加到第一条试试。

    iptables -I INPUT -p tcp --dport 6379 -j ACCEPT
        
然后删除掉之前那个INPUT规则：

    iptables -D 27（规则id）

再试下：

    [opt@devmgr ~]# redis-cli 
    redis 127.0.0.1:6379> 

然后刷新gitlab界面，ok，成功 