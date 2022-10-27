---
layout: post
category : java 
tags : [开源,运维,apache]
---

Apache James是Aapache组织出品的开源邮件系统。可以用它快速搭建一个自己的邮件系统。
<!--break-->

{% include JB/setup %}

 1，下载安装

下载直接去起官方网站下载即可，安装也是个解压过程。

2，配置

2.1，环境配置

apache james运行需要jvm，保证所在主机安装jdk即可

2.2，端口配置

apache james 使用到的端口包括：

pop3端口（110）；SMTP端口（25）；NNTP端口（119）；还有一个telnet服务端口（4555）；这几个端口都在james_home/apps/james/SAR-INF/config.xml配置文件中，可以根据需要自定义这些端口。

2.3，启动应用

配置完毕james后，就可以启动了，启动命令很简单，只需要运行bin/run.sh即可 。也可以使用nohup命令后台运行这个脚本

2.4，创建用户

接下来我们在James上建若干用户。James以telnet 的方式提供了接口用来添加用户。下面我来演示一下。

首先使用telnet来连接james的remote manager .

1.telnet localhost 4555 回车

2.然后输入管理员用户名和密码（user/pwd ： root/root 是默认设置这个可以在config.xml中修改）

    JAMES Remote Administration Tool 2.3.1
    Please enter your login and password
    Login id:
    root
    Password:
    root
    Welcome root. HELP for a list of commands

3.添加用户

    adduser kakaxi kakaxi
    User kakaxi added
    Adduser mingren mingren
    User mingren added

4.查看添加情况

    listusers
    Existing accounts 2
    user: mingren
    user: kakaxi

得到上面的信息说明我们已经添加成功。 