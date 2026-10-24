---
source_sha256: eb16a795b6c700447a63217ccc8c39ccc60d8af5a89c961ef1910c8e045ad45d
title: Configuring and Verifying MySQL Replication
date: '2015-05-08'
lang: en
translation_key: mysql-replication-basics
permalink: /en/2015/05/08/mysql-replication-basics/
description: MySQL replication must connect a consistent data baseline to the binlog position corresponding to that baseline. Configuring a host and starting two threads does not establish that existing data and subsequent changes are complete.
---

MySQL replication must connect a consistent data baseline to the binlog position corresponding to that baseline. Configuring a host and starting two threads does not establish that existing data and subsequent changes are complete.
<!--break-->

The examples use MySQL 5.6 file-and-position replication syntax. MySQL 8.x changed account handling, replication commands and parameter names; do not apply these older commands to every version.

## Assign distinct server IDs

Enable binlogging on the source and use a different server-id for every instance in the replication topology:

```ini
[mysqld]
server-id=1
log-bin=mysql-bin
binlog-format=ROW
```

Set `server-id=2` on the replica. Evaluate memory, SQL mode and table-name case settings against the instance's existing conventions rather than overwriting them just to enable replication. Cross-database transactions and filtering also affect coverage. Keep an introductory setup free of complex filters.

Create a dedicated replication account restricted to the intended replica host, with the required REPLICATION SLAVE privilege. Account creation syntax varies by version. Keep real passwords out of shared scripts and articles.

## Obtain matching data and log coordinates

For target databases using only InnoDB, take a consistent logical backup during a window that prohibits schema changes:

```text
mysqldump -h source-host -u backup_user -p --single-transaction --master-data=2 --databases appdb > appdb.sql
```

The account needs appropriate privileges. `--master-data` still takes a brief global lock while obtaining the position. Confirm the backup completed successfully and retain the recorded binlog file and position. Nontransactional tables or concurrent DDL invalidate this simple consistency assumption; stop writes or use a suitable alternative backup method.

Import into an isolated replica only after confirming that its contents may be replaced, to avoid overwriting independent data. The source must retain binlogs from the backup position onward.

## Start from the backup's coordinates

Use `CHANGE MASTER TO` to set the source address, replication account, `MASTER_LOG_FILE` and `MASTER_LOG_POS` recorded in the backup. Manage credentials through the deployment process. Do not copy another article's log filename and position numbers.

```sql
START SLAVE;
SHOW SLAVE STATUS\G
```

## Verify more than two Yes values

Both `Slave_IO_Running` and `Slave_SQL_Running` being Yes are necessary operational checks. Also inspect errors, log positions and lag, and verify inserts, updates and deletes in the replica. A lag metric alone cannot prove consistency.

Restrict business writes on read-only replicas. An accidental source deletion also replicates, so replication does not replace independent backups. Plan for restart recovery, reconnect catch-up and log retention as part of operations.

**References**

- [MySQL 5.6 replication documentation](https://dev.mysql.com/doc/refman/5.6/en/replication.html)
