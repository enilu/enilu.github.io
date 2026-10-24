---
source_sha256: 65fd6bfd7c5854c2ae64226fe6c23eabf8f0d0c1e48c322815ac1f7a44cb61a3
title: "Reclaiming Space from a 260 GB MySQL Table"
date: 2023-11-03
lang: en
translation_key: mysql-table-space-reclamation
permalink: /en/2023/11/03/mysql-table-space-reclamation/
description: "Rebuilding a large MySQL table, with disk usage changes, table switching and data reconciliation considerations."
---

A table in one of the systems I maintained occupied about 260 GB. Roughly half its data had been deleted to meet business compliance requirements, yet disk usage had barely fallen. With only about 20% free space left, we planned to rebuild the table during a system upgrade window.

The operation took about two hours and forty minutes and reduced the table to about 130 GB. Traffic resumed earlier than expected, and disk usage temporarily reached 93%. Those changes during the operation are as useful to understand as the final space saving.
<!--break-->

## Why deleting rows did not noticeably shrink the file

In InnoDB, space released by deleted records can remain available inside the tablespace for later writes. That is different from immediately returning the same amount of space to the filesystem. Whether a rebuild can return space to the operating system also depends on the tablespace type and other conditions.

I considered `OPTIMIZE TABLE`, rebuilding the table, and copying data into a new table. These options must be compared in terms of schema preservation, additional space, lock waits, duration and application traffic.

For example, `CREATE TABLE new_table SELECT * FROM old_table` does not automatically copy the original indexes. It is not a complete schema clone. For InnoDB, `OPTIMIZE TABLE` maps to a table rebuild. MySQL 8.0 supports online DDL for ordinary InnoDB tables, although brief exclusive locks are still required during preparation and commit. Conditions such as FULLTEXT indexes can cause a table-copy operation instead. Check the actual database version, schema and configuration for the applicable locking behavior and limitations.

## The operation timeline

The chosen approach was to rename and rebuild the old table while creating a new table under the original name to accept traffic if the application resumed early.

| Time | Event |
|---|---|
| 18:00 | Planned service shutdown |
| 18:20 | Actual service shutdown |
| 18:30 | Renamed the old table, created a replacement and proceeded with the rebuild |
| 18:50 | Business traffic resumed earlier than expected |
| 21:00 | Disk usage rose from about 80% to 93% |
| 21:10 | The rebuild completed; disk usage fell to about 63% |
| 21:15 | Merged replacement-table data and restored the original table name |

The initial switch followed this outline:

```sql
-- Switching outline; specific columns and indexes are omitted.
ALTER TABLE t_invoke RENAME t_invoke_bak;
CREATE TABLE t_invoke ...;
```

After renaming, the rebuild targeted `t_invoke_bak`, while the application used the new `t_invoke`. This arrangement accepted the early traffic, but made data reconciliation a critical part of the procedure.

The old table shrank from about 260 GB to 130 GB, with the rebuild taking about two hours and forty minutes. Rebuilding may require additional files and log space, so estimate peak usage during the operation as well as the eventual saving. The final reduction does not establish whether the currently available space is sufficient.

## Resolve data consistency before restoring the name

The restoration sequence used at the time was:

```sql
-- Sequence used at the time; stop relevant writes throughout reconciliation and switching.
INSERT INTO t_invoke_bak SELECT * FROM t_invoke;
DROP TABLE t_invoke;
ALTER TABLE t_invoke_bak RENAME t_invoke;
```

If writes continue after the copy but before the replacement table is dropped, those new rows can be lost. A short interval does not make this safe. Relevant writes must be stopped explicitly, in-flight transactions drained, and background activity accounted for.

The merge also depends on how data changes. Resetting the replacement table's auto-increment starting point could introduce primary-key conflicts. If the application updates or deletes existing records, merely inserting the replacement table's rows does not represent all changes. Before using this approach, establish whether the workload is insert-only, whether keys can conflict and how updates and deletions must be handled. A single copy does not by itself establish complete reconciliation.

Dropping the replacement table before renaming also leaves an interval when the application table name does not exist, and immediately removes data that could help verification. MySQL supports renaming several tables atomically in a single `RENAME TABLE` statement when the documented conditions are satisfied. This addresses name switching, not write coordination or data reconciliation. Foreign keys, triggers and application dependencies require separate checks.

## Organize space reclamation as a complete maintenance procedure

1. Record the database version, tablespace type, schema, indexes and application access patterns. Validate the chosen approach in a test environment.
2. Prepare a recoverable backup and check free space on the data, temporary-file and log volumes. Estimate peak usage for the actual rebuild method instead of relying on a fixed free-space percentage.
3. Establish whether a temporary table switch is necessary. If it is, define key allocation, update/delete handling and reconciliation rules in advance.
4. Before reconciliation and the final switch, stop relevant writes and drain in-flight work. Use explicit column names and verify row counts, important fields and business results, not just successful SQL execution.
5. Verify application access and background jobs after switching. Retain data needed for verification and rollback until the operation is confirmed. If new writes have occurred after the switch, rollback must account for them too.

The lesson is that maintenance windows can change, while consistency requires an explicit mechanism. Reclaimed space is only one outcome. A complete procedure must also explain how data is preserved and how failures can be recovered from.

## References

- [MySQL 8.0: OPTIMIZE TABLE](https://dev.mysql.com/doc/refman/8.0/en/optimize-table.html)
- [MySQL 8.0: CREATE TABLE … SELECT](https://dev.mysql.com/doc/refman/8.0/en/create-table-select.html)
- [MySQL 8.0: RENAME TABLE](https://dev.mysql.com/doc/refman/8.0/en/rename-table.html)
