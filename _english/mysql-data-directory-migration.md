---
source_sha256: c8ec1ded5f8c7d5b0eafe4f54c2c49e537a44feeec560a8726436bd4554af8dd
title: Moving a MySQL Data Directory on Linux
date: '2015-05-07'
lang: en
translation_key: mysql-data-directory-migration
permalink: /en/2015/05/07/mysql-data-directory-migration/
description: Moving a MySQL data directory involves more than copying files to another disk. Service configuration, ownership, parent-directory permissions and SELinux labels all affect access. This workflow uses a CentOS 6.5 and MySQL 5.6 maintenance s
---

Moving a MySQL data directory involves more than copying files to another disk. Service configuration, ownership, parent-directory permissions and SELinux labels all affect access. This workflow uses a CentOS 6.5 and MySQL 5.6 maintenance scenario; adapt service commands to the actual installation.
<!--break-->

## Confirm runtime configuration and recovery

```sql
SHOW VARIABLES LIKE 'datadir';
SHOW VARIABLES LIKE 'log_error';
```

Confirm that the connection reaches the intended instance and identify the configuration files it actually reads. Prepare a recoverable backup and maintenance window. Record whether data, logs and binlogs live in separate locations. Copying selected database directories may omit files the instance needs.

## Stop writes and copy offline

Stop application writes, stop MySQL through its service manager, and confirm that its process has exited. Older systems commonly use `service mysqld stop`; systemd installations require the actual unit name. Do not mix the two blindly.

For a destination such as `/data/mysql`, first verify capacity and mount status. Use a copy method that preserves permissions and links, such as rsync if installed:

```text
rsync -aH /var/lib/mysql/ /data/mysql/
```

Understand the trailing slashes on both paths. Keep the database stopped throughout copying. Check files, ownership and permissions afterward, then change `datadir` in the actual configuration. Retain the old directory until validation so a failed copy or configuration error remains recoverable.

## Permission denied involves more than ownership

For errors such as `Can't change dir` or `Can't create test file`, check the mount, the mysql user's traversal permission on every parent directory, file ownership and modes, and SELinux denials.

On SELinux systems, assign the appropriate database file context to the new path and apply it with restorecon. Use the distribution's policy for exact types and commands. Disabling SELinux or making the directory writable by everyone should not be a default migration step.

## Validate business behavior after startup

Start the correct service and inspect its error log. Query datadir again, and verify existing data and application reads and writes. Check binlogs, replication, backup jobs and automatic mounting after reboot, rather than accepting one successful startup as sufficient.

Rollback also requires stopping writes. If the new directory has already accepted business changes, simply starting the old copy would lose them. Remove old data only after defining the end of validation and a cleanup time.

**References**

- [MySQL data directory](https://dev.mysql.com/doc/refman/5.7/en/data-directory.html)
- [MySQL SELinux](https://dev.mysql.com/doc/refman/8.0/en/selinux.html)
