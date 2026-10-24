---
source_sha256: 20eb0f86e6b1c499e9dab324887bc9ddbce137d354309548c6d4d2567fe99f2a
title: Getting Started with SQLite
date: '2016-01-16'
lang: en
translation_key: sqlite-basics
permalink: /en/2016/01/16/sqlite-basics/
description: 'SQLite embeds a database engine inside an application without a separate database server. It suits local tools, desktop applications and devices with structured data. Select it based on access patterns and concurrency rather than a blanket '
---

SQLite embeds a database engine inside an application without a separate database server. It suits local tools, desktop applications and devices with structured data. Select it based on access patterns and concurrency rather than a blanket claim that it is faster than other databases.
<!--break-->

## Start with a small database

Install the platform's sqlite3 command-line tool and run this in a test directory:

```text
sqlite3 hello.db
```

Then enter:

```sql
CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
INSERT INTO users(name) VALUES ('Alice');
SELECT id, name FROM users;
```

`.tables`, `.schema users` and `.databases` are shell dot commands, not SQL submitted to the database. A missing database file is generally created when a write actually occurs. Entering the shell alone does not establish persistence.

## Understand keys and types

`INTEGER PRIMARY KEY` usually aliases rowid and can allocate integer keys automatically. `AUTOINCREMENT` has the more specific semantics of avoiding reuse of previously used rowids, with additional cost. It is not mandatory for an ordinary generated key.

SQLite's type rules differ from MySQL. Declaring VARCHAR(32), for example, does not automatically enforce a 32-character limit. Express constraints with appropriate CHECK rules, application validation and type mechanisms supported by the target version.

## Manage concurrency and files

SQLite supports multiple readers but only one writer at a time. Transaction mode, busy timeout and WAL affect concurrency. It is inaccurate to say every transaction locks the whole file in the same way.

The main database is one file, but runtime journal, WAL and shared-memory files may also exist. Copying only the main file while active may not produce a complete consistent backup. Use the backup API or a proper quiesced backup procedure. A shared network drive is also not a general replacement for a database server.

## Use SQLite from Java

A SQLite JDBC driver can connect to `jdbc:sqlite:hello.db`. Use try-with-resources for connections, statements and result sets, and parameterized SQL. Define paths, transaction boundaries and competition between writing connections.

SQLite core does not have traditional server-style user login management. This should not be described as a free version without passwords and a paid version with them. Filesystem permissions and encryption extensions address separate layers and should be selected separately for deployment needs.

**References**

- [SQLite When to use SQLite](https://www.sqlite.org/whentouse.html)
- [transactions](https://www.sqlite.org/lang_transaction.html)
- [Backup API](https://www.sqlite.org/backup.html)
