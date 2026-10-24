---
layout: post
category : 数据库 
keywords : "linux,运维,mysql,mysql目录迁移"
description: "MySQL 数据目录迁移，不只是把文件挪到另一块磁盘。服务配置、文件属主、父目录权限和 SELinux 标签，都可能决定新目录能否被正常访问。下面以 CentOS 6.5、MySQL 5.6 的维护场景说明流程，服务命令需按实际安装方式调整。"
tags : [linux,运维,mysql]
lang: zh-CN
translation_key: mysql-data-directory-migration
---

MySQL 数据目录迁移，不只是把文件挪到另一块磁盘。服务配置、文件属主、父目录权限和 SELinux 标签，都可能决定新目录能否被正常访问。下面以 CentOS 6.5、MySQL 5.6 的维护场景说明流程，服务命令需按实际安装方式调整。
<!--break-->

{% include JB/setup %}

## 先确认运行配置与恢复方式

```sql
SHOW VARIABLES LIKE 'datadir';
SHOW VARIABLES LIKE 'log_error';
```

确认连接的是目标实例，并查清它实际读取的配置文件。准备可恢复备份及维护窗口，记录数据目录、日志和 binlog 是否位于不同位置；不要只复制某几个数据库目录而遗漏实例所需文件。

## 停止写入后离线复制

先停应用写入，再按服务管理方式停止 MySQL，并确认进程已经退出。旧系统常用 `service mysqld stop`，systemd 安装则应检查实际 unit 名称，不能混用。

以迁移到 `/data/mysql` 为例，目标目录应提前确认容量和挂载状态。可使用保留权限及链接的复制方式，例如安装了 rsync 时：

```text
rsync -aH /var/lib/mysql/ /data/mysql/
```

命令两端的尾斜杠含义应确认。复制期间数据库必须保持停止，完成后核对文件、属主和权限，并修改实际配置里的 `datadir`。旧目录先保留，避免移动失败或配置错误时失去退路。

## Permission denied 不只看目录属主

日志出现 `Can't change dir` 或 `Can't create test file` 时，依次检查：目标是否挂载、mysql 用户是否能穿过每一级父目录、文件属主与模式是否正确，以及 SELinux 是否拒绝访问。

启用 SELinux 的系统应为新路径设置合适的数据库文件上下文，并用 restorecon 应用标签；具体类型与命令以发行版策略为准。不要把关闭 SELinux 或给所有用户写权限作为目录迁移的默认步骤。

## 启动后核对业务

使用正确的服务名启动，读取错误日志，再次查询 datadir，确认应用读写和已有数据正常。验证 binlog、复制、备份任务及重启后的自动挂载，避免只是这次启动成功。

回退也要先停写。如果新目录启动后已有业务写入，不能直接启用旧副本，否则会丢掉迁移后的变化。明确验证结束和清理时间后，再删除旧数据。

参考：[MySQL 数据目录](https://dev.mysql.com/doc/refman/5.7/en/data-directory.html)、[MySQL SELinux](https://dev.mysql.com/doc/refman/8.0/en/selinux.html)。
