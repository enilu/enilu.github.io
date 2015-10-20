#mysql主从配置

    版本：mysql5.6
    os:centos6.5
    主服务器：（192.168.1.1），从服务器：(192.168.1.2)

##配置主服务器

- 修改/etc/my.cnf文件 
- 在[mysqld]下面增加：

        server-id=1
        log-bin=mysqlmaster-bin.log
        sync_binlog=1
        innodb_buffer_pool_size=8192M #建议配置为内存的70%
        innodb_flush_log_at_trx_commit=1
        sql_mode=STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION,NO_AUTO_VALUE_ON_ZERO
        lower_case_table_names=1
        log_bin_trust_function_creators=1
        read-only=0
        binlog-do-db=dbname #要同步的数据库，可以配置多个
        binlog-do-db=dbname2

- 重启mysql服务：

        sudo /etc/init.d/mysqld restart

## 配置从服务器

- 修改/etc/my.cnf文件 
 在[mysqld]下面增加：

        server-id=2
        log-bin=mysqlslave-bin.log
        sync_binlog=1
        innodb_buffer_pool_size=8096M  #建议配置为内存的70%
        innodb_flush_log_at_trx_commit=1
        sql_mode=STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION,NO_AUTO_VALUE_ON_ZERO
        lower_case_table_names=1
        log_bin_trust_function_creators=1
- 重启mysql服务：

        sudo /etc/init.d/mysqld restart
- 主数据库上增加从数据库账户

登录数据库，执行： 

    mysql> GRANT REPLICATION SLAVE ON . to ‘username’@’192.168.1.2’ identified by ‘password’; 
    锁表（禁止再插入数据以获取主数据库的的二进制日志坐标）： 
    FLUSH TABLES WITH READ LOCK;

- 获取主数据库二进制日志状态：

        mysql> SHOW MASTER STATUS \G;
        *************************** 1. row ***************************
        File: mysqlmaster-bin.000001
        Position: 336
        Binlog_Do_DB: td
        Binlog_Ignore_DB: 
        Executed_Gtid_Set: 
        1 row in set (0.00 sec)
- 在从数据库服务器中导出主数据库的数据库数据：

        mysqldump -uroot -peasecredit2015 -h192.168.1.1  --all-databases  --triggers --routines --events >all.sql
-然后导入到 从数据库自己的数据库中：

        mysql -uroot -peasecredit2015 <all.sql
- 给从数据库设置复制的主数据库信息（注意修改MASTER_LOG_FILE和MASTER_LOG_POS的值）

        mysql> CHANGE MASTER TO MASTER_HOST='192.168.1.1',MASTER_USER='username',MASTER_PASSWORD='password',MASTER_LOG_FILE='mysqlmaster-bin.000001',MASTER_LOG_POS=336;
- 在从服务器：启动从数据库的复制线程

        mysql> START slave;
- 接着查询数据库的slave状态：

        mysql> SHOW slave STATUS \G
- 如果下面两个参数都是Yes，则说明主从配置成功！

        Slave_IO_Running: Yes        
        Slave_SQL_Running: Yes
## 测试

在主数据库上创建一个test表，并插入数据，查看从服务器也有更新即可。