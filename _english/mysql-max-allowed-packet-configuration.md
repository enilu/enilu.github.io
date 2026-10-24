---
source_sha256: 583d8b2e815880486637da31542661dbfd9a6111d0e80f49916fad49a91869d7
title: "When max_allowed_packet Does Not Match the Configuration"
date: 2015-12-21
lang: en
translation_key: mysql-max-allowed-packet-configuration
permalink: /en/2015/12/21/mysql-max-allowed-packet-configuration/
description: "Investigating a packet-size error through option files, global and session values, and client limits."
---

When a server reported `Packet for query is too large`, I initially thought increasing `max_allowed_packet` would be enough. The configuration file had already been changed, yet a query still showed a small value. This incident illustrates why file configuration, the running global value and the current connection's session value must be checked separately.
<!--break-->

## Why did the file configuration not take effect?

The database stored large strings, so I had configured:

```ini
[mysqld]
max_allowed_packet=512M
```

512M was the value used at the time, not a general recommendation. Choose a limit based on actual requests, returned row sizes and concurrent memory demand.

When the error returned, the queried value was only 4194304 bytes, or 4 MiB. Several `my.cnf` files existed on the machine, and I had edited a file that the instance did not actually use. Correcting the active configuration and applying it resolved that occurrence.

Finding files only identifies candidates. Also check the connected instance, the service startup command, which files are read and whether later settings override earlier ones. The existence of `/etc/my.cnf` does not establish that it supplies the final value.

## Global and session values are different

Compare them in the same connection:

```sql
SELECT @@GLOBAL.max_allowed_packet,
       @@SESSION.max_allowed_packet;
```

`SHOW VARIABLES` without an explicit scope defaults to session values. After changing the global value, you can inspect that global value immediately without reconnecting:

```sql
-- Example limit of 512 MiB; appropriate privileges are required.
SET GLOBAL max_allowed_packet = 512 * 1024 * 1024;
SHOW GLOBAL VARIABLES LIKE 'max_allowed_packet';
```

New connections initialize their session value from the global value. Existing connections do not automatically update their session value after this global change. In MySQL 8.0, this variable's session value is read-only. With a connection pool, a new application request does not necessarily create a new database connection.

`SET GLOBAL` changes the runtime setting; it does not write back to `my.cnf`. To retain a value after restart, maintain and verify the active startup configuration. MySQL 8.0 also provides `SET PERSIST`; check that the target version supports it before using it.

## Check the client too

`max_allowed_packet` is not simply a field-length limit. Protocol packets and generated or intermediate strings can also be affected. Clients can have their own packet-size limits, so investigate the actual command-line client or driver and the location of the error.

For example, the `mysql` client accepts:

```text
mysql --max_allowed_packet=512M
```

This does not change the server setting, and it is not a command-line option that a Java application can automatically reuse. Consult the relevant driver's configuration documentation.

## If a smaller value appears again, check the instance and connection

Record the instance identity, global and session values, and timestamps. Then investigate restarts, connection changes, overridden configuration and modifications by management tools.

A runtime change that was not persisted can revert to the startup configuration after a restart. Connecting to a different instance can also show a different setting. Establish this context before concluding that a value actually changed.

Sufficient memory for large requests is a separate consideration. Increasing `innodb_buffer_pool_size` is not a substitute for identifying the setting source and connection state.

## References

- [MySQL 8.0: max_allowed_packet](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_max_allowed_packet)
- [MySQL 8.0: Packet Too Large](https://dev.mysql.com/doc/refman/8.0/en/packet-too-large.html)
- [MySQL 8.0: option files](https://dev.mysql.com/doc/refman/8.0/en/option-files.html)
