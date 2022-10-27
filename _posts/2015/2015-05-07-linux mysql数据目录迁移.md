---
layout: post
category : 数据库 
keywords : "linux,运维,mysql,mysql目录迁移"
description : "linux中mysql目录迁移步骤"
tags : [linux,运维,mysql]
---


准备工作

    版本：centos:6.5 64位 mysql:5.6

    先说下mysql目录结构

centos6.5下安装mysql5.6后 mysql的数据目录，通过查看/etc/my.cnf
<!--break-->

{% include JB/setup %}



然后my.cnf中会列出几个默认的目录：

数据目录 ： datadir=/var/lib/mysql
日志文件：log-error=/var/log/mysqld.log
进程id文件：pid-file=/var/run/mysqld/mysqld.pid

目录迁移过程：

- 假如要迁移到的目录为：/data/mysql
- 首先停止mysql，service mysqld stop 或者/etc/init.d/mysqld stop
- 移动数据目录：

        mv /var/lib/mysql /data/

- 查看新的data目录是不是都是mysql用户组下的：

        ll /data/mysql

- 确认无误后，启动mysql：

        /etc/init.d start

- 这时候可能启动不成功，查看日志/var/log/mysqld.log 会发现下面字样：

        2015-06-08 11:11:11 0 [Note] /usr/sbin/mysqld (mysqld 5.6.24) starting as process 4839 ...
        2015-06-08 11:11:11 4839 [Warning] Can't create test file /data/mysql/dataengine3.lower-test
        2015-06-08 11:11:11 4839 [Warning] Can't create test file /data/mysql/dataengine3.lower-test
        /usr/sbin/mysqld: Can't change dir to '/data/mysql/' (Errcode: 13 - Permission denied)
        2015-06-08 11:11:11 4839 [ERROR] Aborting
        2015-06-08 11:11:11 4839 [Note] Binlog end
        2015-06-08 11:11:11 4839 [Note] /usr/sbin/mysqld: Shutdown complete

- 这个时候如果确保mysql的data目录已经在mysql用户组下，那么可能是selinux的问题。解决方法为：
    
    - 临时关闭selinux：

            setenforce 0

    - 修改/etc/selinux/config文件中设置SELINUX=disabled
    - 然后重启服务器。
- 迁移目录的时候也可以不更改配置文件，而只是将数据目录迁移出来，没有实验这种方式可不可以解决selinux权限的问题。
