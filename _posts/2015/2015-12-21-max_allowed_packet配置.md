---
layout: post
category : 数据库 
keywords: "mysql,运维,max_allowed_packet"
description: "从 Packet too large 错误排查 MySQL 配置文件、全局值、会话值与客户端限制。"
tags : [mysql, 运维]
lang: zh-CN
translation_key: mysql-max-allowed-packet-configuration
---

服务器报出 `Packet for query is too large` 时，我以为只需要调大 `max_allowed_packet`。但配置文件明明已经修改，实际查询到的值却仍然很小。这次问题提醒我：配置文件里的值、运行中的全局值和当前连接的会话值，需要分开确认。
<!--break-->

{% include JB/setup %}

## 配置写了，为什么没有生效

当时数据库存储了较大的字符串，我在配置文件中设置：

```ini
[mysqld]
max_allowed_packet=512M
```

这里的 512M 是当时的取值，不是通用推荐。应根据实际请求、返回行大小和并发内存需求选择上限。

后来再次报错，我查询到的 `max_allowed_packet` 却只有 4194304 字节，即 4MiB。查找后发现机器上存在多个 `my.cnf`，我修改的不是这个实例实际使用的文件。修改正确的配置并使其生效后，当次问题得到解决。

查找文件只能得到候选位置，还要确认实际连接的是哪个实例、服务用什么命令启动、读取哪些配置，以及后读的配置是否覆盖了前面的值。不能因为找到了 `/etc/my.cnf` 就认定它一定是最终配置。

## 区分全局值和当前连接的值

可以在同一个连接中对照查询：

```sql
SELECT @@GLOBAL.max_allowed_packet,
       @@SESSION.max_allowed_packet;
```

不指定作用范围的 `SHOW VARIABLES` 默认展示会话值。用下面的语句修改全局值后，不需要重新登录就能查询全局值：

```sql
-- 示例上限为 512MiB，修改需要相应权限。
SET GLOBAL max_allowed_packet = 512 * 1024 * 1024;
SHOW GLOBAL VARIABLES LIKE 'max_allowed_packet';
```

新连接的会话值会按全局值初始化，已有连接的会话值不会因这条全局修改就同步更新。在 MySQL 8.0 中，该变量的会话值是只读的。应用若使用连接池，也要注意逻辑上的一次请求不等于新建一个数据库连接。

`SET GLOBAL` 是运行时修改，不会自动写回 `my.cnf`。如果要重启后仍使用指定值，需要正确维护启动配置并验证。MySQL 8.0 还提供 `SET PERSIST` 机制；使用前应确认目标版本是否支持。

## 别漏掉客户端限制

`max_allowed_packet` 限制的不只是某个字段的长度，协议包、生成或中间字符串等也可能受限。客户端同样可能有包大小限制；排查时要根据使用的命令行客户端、驱动和实际错误位置分别确认。

例如，`mysql` 客户端可以这样设置自己的上限：

```text
mysql --max_allowed_packet=512M
```

这不等于修改服务端，也不代表 Java 应用可以直接使用相同的命令行参数。应查对应驱动的配置说明。

## 参数再次变小时，沿着实例和连接排查

如果修改后又观察到较小的值，先记录实例标识、全局值、会话值和时间，再检查期间是否发生重启、连接变化、配置覆盖或其他管理程序修改。

例如，运行时修改没有持久化，重启后就可能恢复启动配置；查询换到了另一个实例，看到的也可能是不同设置。只有把这些信息对上，才能判断参数是否真的发生了变化。

内存是否足够处理大请求是另一项需要评估的条件，不能用调大 `innodb_buffer_pool_size` 来代替对参数来源和连接状态的检查。

## 参考资料

- [MySQL 8.0：max_allowed_packet](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_max_allowed_packet)
- [MySQL 8.0：Packet Too Large](https://dev.mysql.com/doc/refman/8.0/en/packet-too-large.html)
- [MySQL 8.0：使用选项文件](https://dev.mysql.com/doc/refman/8.0/en/option-files.html)
