---
source_sha256: f1966f6acd446a9a100c3ac8aa68d0bb1218d4671818644bcc32b3bb7922ad72
title: "Sharpening My Developer Tools for the AI Era"
date: 2026-10-22
lang: en
translation_key: ai-era-developer-toolkit
permalink: /en/2026/10/22/ai-era-developer-toolkit/
description: "Why I chose Paseo, DBX, Zed and Tabby, and how I adapted them so that humans and AI can work with the same projects, connections and working context."
tags: [AI, Development tools, Engineering practice, Open source]
---

Yesterday I wrote about [organizing AI development across projects and tasks with an aggregate workspace](/en/2026/10/21/ai-multi-project-workspace/). Once projects and tasks are organized, another question remains: which tools will AI actually use to do the work? Recently, I have replaced or adapted several long-standing tools, settling on Paseo, DBX, Zed and Tabby. This is not a feature ranking. It is an account of why I chose them and what I had to improve to make them work together.
<!--break-->

## First, make the tools accessible

I used to choose developer tools mainly for my own convenience: a useful interface, familiar shortcuts and a comprehensive feature set. Now there is another user to consider: AI.

Suppose my database client already contains a test connection. I can open it and inspect a table. But if AI needs the same database and I must provide the host, username and password again, then write a temporary connection script, that tool might as well not exist from the agent's perspective.

SSH has the same problem. I maintain server groups, connections and authentication settings in a client, while AI uses a separate host inventory. Eventually, one gets updated and the other becomes stale, and even I can lose track of which is correct.

I now ask a few additional questions when evaluating a tool:

- Can AI reuse information I maintain in the interface through a stable API or command?
- Can it return structured results and meaningful errors instead of making me explain a screenshot?
- Can work continue after changing agents or computers?
- Can I fix an awkward behavior and maintain that change over time?

For me, moving beyond a purely manual toolchain means dropping the assumption that someone will watch every screen and click through every step. A tool's usability should include the cost of moving context back and forth between a person and AI.

## Paseo: one workbench, with a choice of agents

I do not want to tie my daily workflow to one AI agent client.

I follow tools such as Codex, Claude Code, Zcode and OpenCode. Different agents and models may suit different tasks or stages. If each change also requires a different interface and a new set of habits, switching becomes expensive.

I chose Paseo to keep the workbench relatively stable. It provides a common interface for agents with supported adapters; the upstream project explicitly supports Claude Code, Codex and OpenCode, among others. The actual adapter and version determine the extent of integration. This does not mean any CLI can be plugged in without additional work. [Paseo's official repository](https://github.com/getpaseo/paseo)

Two aspects matter most to me.

### Separate the entry point from the executor

Project directories, task descriptions, branches and verification results are assets I want to retain. The agent doing today's work is a choice I want to be able to change.

Paseo reduces the friction of changing interfaces. The aggregate workspace described yesterday keeps rules and task context in files. Together, they make continuing work easier than leaving all knowledge inside one client's conversation history.

A common interface does not make every agent's capabilities, permissions or history format identical. Nor does it guarantee that an unfinished conversation can be handed arbitrarily to a different agent. Continuity still depends on explicit task state, a known code working context and useful handover materials.

### Reach the same development environment from different devices

Paseo's agents run on the machine hosting its daemon. Desktop, web and mobile clients provide different ways into that environment.

That distinction matters. My phone does not need another compiler installation or another copy of a repository. Away from my desk, I can check tasks and output on the same development machine, provide additional instructions or respond to a confirmation.

The convenience comes from keeping the development environment in place, rather than merely giving a chat page a mobile layout. The machine and its connectivity services still need to be online. Model requests also follow each agent's configured services; adding a workbench does not automatically make execution offline.

In my personal Paseo version, I added project and workspace access protection, file previews and downloads, and controls over conversation sharing. Those changes adapt the entry point to my workflow. They should not be confused with features contributed by the upstream project.

## DBX: maintain a connection once, and let AI reuse it

Database configuration is something I especially want to avoid maintaining twice.

I chose DBX for its open source code and customizability, as well as its desktop, CLI and MCP interfaces. Its desktop application uses Tauri, with a backend implemented primarily in Rust. The CLI can read the connection storage used by the desktop client. [DBX's official repository](https://github.com/t8y2/dbx)

I can maintain a connection in the GUI and use it interactively. When AI needs a schema or a query, it can use that same connection through the CLI instead of asking me to paste a password into a prompt.

A typical sequence looks like this:

```powershell
# Check which configuration the CLI uses and what it supports
dbx doctor --json
dbx capabilities --json
dbx connections list --json

# This connection name is an example; select one from the actual list
dbx schema list '业务测试库' --json
dbx query '业务测试库' 'select 1 as ok' --limit 10 --timeout 10s --json
```

The essential point is that **the GUI and CLI must use the same data directory**. With portable installations or multiple versions, launching the correct executable does not guarantee that it reads the correct connection store. I check with `doctor` first. My portable build also includes a wrapper that directs the matching CLI to the adjacent data directory.

Synchronization addresses a different layer: avoiding the need to enter every connection again on another computer. DBX supports configuration cloud sync, but connection metadata, sensitive values and device-local keys have different boundaries. Copying a database file is not a universal migration method. [DBX synchronization documentation](https://dbxio.com/en/docs/cloud-sync)

Likewise, listing a connection does not prove that the CLI can query every database type or fully manage connections. I check its capability report; some database types need a desktop bridge or another driver path. My sequence is to establish capabilities, inspect the schema, then issue queries with row and time limits.

**Sharing connection information does not mean giving AI all the operator's permissions.** Queries and writes remain distinct, and production operations retain their own boundaries. A useful integration should help enforce those boundaries rather than leave them as reminders.

I also care about resource use. With multiple projects, terminals and database connections open, applications that each seem modest can add up. Rust, Tauri and not bundling a full Chromium runtime are attractive aspects of DBX. I have not run a controlled comparison under identical workloads, though, and a programming language alone cannot establish lower memory consumption in every case.

I have also adapted object navigation and MySQL table details in my personal version. Choosing a tool sets the direction; small, concrete improvements determine how comfortable it feels every day.

## Zed: an editor organized around several projects

I used to rely heavily on IntelliJ IDEA. Navigation, builds, tests, debugging and framework integrations were conveniently available in one application.

Now AI runs more of the build and test commands. My own work has shifted toward reading changes, following call chains, reviewing diffs and judging whether an implementation meets the requirement. Conveniently inspecting multiple projects has become more important.

A feature can span the frontend, an API and a backend data service. I do not want to hunt through several separate windows just to follow one chain of changes.

I chose Zed and maintain my own build, focusing on opening, closing, saving and restoring multiple projects in one window, along with Windows recent-project entry points. Upstream Zed also supports multi-project workflows. My changes adapt that behavior to my own version and workflow; I am not claiming the upstream editor lacks the capability. [Zed's multi-project documentation](https://github.com/zed-industries/zed/blob/main/docs/src/windows-and-projects.md)

The editor connects to the aggregate workspace and fixed workspace pool described yesterday. AI works in the directories assigned to a task, and I inspect the corresponding repositories in the editor. Easier project switching makes reviewing a cross-service change more continuous.

Having AI run builds and tests does not make debuggers or IDE capabilities worthless. Dedicated debugging tools still help with complex runtime problems. They simply no longer need to be the always-open center of every project in my daily workflow, which is why I moved from IDEA to Zed.

## Tabby: server connections should be reusable too

For SSH, I replaced Xshell with Tabby.

Connection management, cross-platform support, configuration sync and room for further automation are the qualities I value. [Tabby's official repository](https://github.com/Eugeny/tabby)

My current setup connects Tabby's configuration-sync feature to a small synchronization service I host. On a new computer, I download the existing configuration, check its connections and groups, then enable automatic sync. I avoid layering several synchronization plugins over the same configuration and having them overwrite one another.

Configuration sync does not mean another machine immediately has identical login capabilities. Windows Credential Manager passwords do not automatically travel with YAML. SSH private-key files, local paths, VPN access and network conditions need separate preparation. Understanding those boundaries is more useful than claiming that everything synchronizes with one click.

For AI access, I added another layer: `tabby-bridge`.

It is an on-demand CLI that reads Tabby's saved SSH connections and uses authentication available on the current machine to run commands or transfer individual files. Tabby does not have to stay open, and I do not need another server inventory for AI.

```powershell
# Find a connection, then use its exact ID to avoid ambiguous names
tabby-bridge list --search '测试' --json
tabby-bridge exec --id '<connection-id>' --command 'uname -a' --json
```

The distinction matters: **Tabby is my connection-management tool; `tabby-bridge` is an adapter I added for my AI workflow.** My bridge should not be presented as a native Tabby feature that supports every agent.

It also has practical limits. It does not expose every Tabby feature, including some jump-host and proxy configurations or persistent interactive sessions. Unsupported settings should produce an error rather than be silently ignored. Structured output must distinguish a remote command failure from a failure to connect at all.

With shared connections, I also want verified host identity, timeouts and exit codes. A timed-out SSH connection does not prove that its remote process has ended. Before retrying, the agent still needs to inspect the running state. Those details determine whether a script is suitable for repeated AI use.

## What I am choosing is a connected workflow

Together, the four tools have distinct responsibilities:

| Activity | My tools | Main purpose |
| --- | --- | --- |
| Enter the AI working environment | Paseo | A common interface, a choice of supported agents and access across devices |
| Read and review code | Customized Zed | Manage related projects in one window and save or restore the workspace |
| Access databases | DBX GUI + CLI | Share connection and schema information between people and AI |
| Access servers | Tabby + tabby-bridge | Let people maintain connections and AI reuse them through a callable interface |

For an API investigation, I want to describe the task in Paseo, have AI locate the frontend and backend from workspace records, inspect the designated database connection through DBX, and check a server through the Tabby bridge when necessary. I can then review the affected projects and evidence in Zed.

That describes how to organize a workflow, not a requirement to invoke all four tools for every task. If code and documentation already answer the question, there is no reason to access a database or server merely to demonstrate integration.

What the GUI and AI interface share is maintained project information, connections and working state. The executor can change. Results return as files, diffs and reports that I can read and verify.

## Customization has a maintenance bill

Open source lets me change awkward behavior, but maintaining a fork is not a one-time job.

Upstream updates can introduce conflicts. Desktop applications and CLIs may need matching releases. Updating source code does not update an installed application until it has been built and installed. I try to keep upstream synchronization separate from my personal working branch, preserve the history of my customizations, and document packaging, installation and verification in scripts, Skills and maintenance notes.

Whether a change is worth making depends on how often the friction occurs. An occasional extra click may not justify a long-lived patch. Restoring several projects every day, or repeatedly maintaining duplicate connections for AI, is a more compelling reason to invest.

Resource consumption belongs in that calculation too. Although I appreciate the implementation approaches used by DBX and Zed, Tabby and the Paseo desktop client I use are themselves built with Electron. My choices are based on whether the problem solved justifies the resource and maintenance cost, rather than rejecting an application on the basis of its framework name.

When evaluating the next tool, I will again ask whether it reuses existing state, exposes callable capabilities, returns verifiable results, and has a maintenance cost I can afford.

There is an old saying: to do good work, first sharpen your tools. With AI participating in development, a good tool should be comfortable for me while remaining accessible to an agent, understandable in its inputs and outputs, and accountable for its results. Improving that interface can remove more daily context copying and explanation than switching to yet another model.
