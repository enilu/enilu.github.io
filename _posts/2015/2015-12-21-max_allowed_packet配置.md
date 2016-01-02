---
layout: post
category : mysql 
keywords: "mysql,运维,max_allowed_packet"
description : "解决mysql报出的Packet for query is too large错误，使用max_allowed_packet配置。"
tags : [mysql, 运维]

---

 最近服务器经常报Packet for query is too large的错误,心想配置更改过了啊，怎么还会报错。
<!--break-->

{% include JB/setup %}

因为数据库中有存很大的字符串值，很多都有上百MB，所以数据库刚安装好后，就在my.cnf中进行了如下配置：

    max_allowed_packet=512M
    
用了一段时间没有问题，但是最近频频报错。仔细检查了配置，没有错啊，确实是512MB，而且我确定我写入的字符串远远小于512MB。
只好登录mysql使用命令查看
    
    show VARIABLES like '%max_allowed_packet%';
    +--------------------------+------------+
    | Variable_name            | Value      |
    +--------------------------+------------+
    | max_allowed_packet       | 4194304    |
    | slave_max_allowed_packet | 1073741824 |
    +--------------------------+------------+
    2 rows in set (0.04 sec)

怪了，我明明配置的是512MB，按理这里应该显示值为：536870912 （512MB*1024*1024）字节。
然后使用locate my.cnf查找my.cnf文件，发现有好几个my.cnf配置文件，一检查，果然mysql用的不是/etc/my.cnf。于是把当前mysql服务使用的那个配置文件更改了下，ok了。

也可以通过下面语句更改

    set global max_allowed_packet =512*1024*1024;
    
不过更改后需要退出后重新登录后才能使用show命令查询到更改的值。

另外，也可以在启动的时候制定配置文件来解决问题：

    mysqld_safe --defaults-file=file_name
    
当然最好的办法是在编译的时候显式制定配置文件：

    ./configure  --sysconfdir=/etc 

## 2015-12-25 更新

max allowed packet 虽然更改了，而且当下也生效，没有问题，但是过一两天，就有自动重置了。
后来查网上说是，内存太小，但是我把内存从4g升级到8g，还是不行。突然看到我的配置文件中有这么两行：

	# cache in MySQL. Start at 70% of total RAM for dedicated server, else 10%.
	innodb_buffer_pool_size = 512M

也许是因为我的innodb_buffer_pool_size 配置太小了，当前配置值距离内存的70%还远着呢，果断将值更改为4096M，等两天看看了

        
