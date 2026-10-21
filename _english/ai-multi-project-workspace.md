---
source_sha256: 80ae88cdca5cf68d38c243d40938807fa90659aa76c948c5ec7aeb73f4d61d8a
title: "Managing Multi-Project AI Development with an Aggregate Workspace"
date: 2026-10-21
lang: en
translation_key: ai-multi-project-workspace
permalink: /en/2026/10/21/ai-multi-project-workspace/
description: "How I use a project registry, task records and a reusable workspace pool to organize AI development across repositories and tasks."
tags: [AI, Development tools, Engineering practice, Git]
---

Recently, I brought several projects I maintain into an aggregate workspace. The aim was to give AI a single entry point for changes spanning repositories, while letting me work on several tasks at once. Putting the directories together turned out to be only the beginning. I also needed to decide how to find the right project, where to change code, how to resume a task, and what counts as finished. Here is the approach I use today.
<!--break-->

## Why create an aggregate workspace?

The systems I maintain consist of independent frontend, backend and data-service repositories, along with batch-processing and automated-testing projects. A single request often touches several of them.

Adding a search filter, for example, may require a frontend input, an API parameter and a condition in the data service. I usually know that call chain. An AI session needs to discover it: where the frontend lives, which API it calls, and which service is actually in use.

Explaining all this again in each new conversation gets tedious. With old and new services running alongside each other, guessing from repository names is unreliable, too.

I also want to develop one feature while investigating another issue, with a third task waiting for feedback from testing. If all those sessions edit the same working directory, one can switch branches underneath another. Uncommitted changes from different tasks can get mixed together. Fast code generation does not make that mess any easier to untangle.

My setup therefore addresses two practical needs: helping AI find the correct projects, and giving different tasks separate places to work on code.

## Centralize project entry points and rules

The aggregate workspace is its own Git repository. It stores project navigation, collaboration rules and helper scripts. Business projects retain their own repositories and commit histories.

The project names below are generic, and the layout is simplified:

```text
system-workspace/
├── README.md                   # Workspace overview and reading order
├── AGENTS.md                   # AI entry point and rule routing
├── config/
│   └── projects.json           # Project registry
├── projects/                   # Project browsing entry points
│   ├── web-app/                # Junction to the original repository
│   ├── api-service/
│   └── data-service/
├── doc/ai/
│   ├── standards/current/      # Rules organized by activity
│   ├── skills/                 # Reusable workflows
│   └── prompts/                # Short prompt templates
├── scripts/                    # Project, task and workspace helpers
├── tasks/                      # Task records
└── runtime/                    # Requirements, logs and temporary output
```

On Windows, I use junctions to link repositories from their original locations into `projects/`. This gives me one place to browse without moving the source directories.

One detail matters here: **a junction points to the original directory. Editing a file through it changes the source project directly.** It provides no task isolation.

In this workspace, the external project entries mainly serve navigation and reference. Formal business development happens in the fixed workspace pool described below. A few tools maintained directly in the aggregate repository follow their own rules.

## A project registry answers “which repository should change?”

A collection of directory links still needs a project map that both humans and AI can read.

I keep responsibilities, aliases, entry points, source repositories, branch roles and call chains in a project registry. Scripts query it or generate readable documentation. For example:

```text
Page search feature: web-app -> api-service -> data-service
Data production job: batch-job -> data-service
Functional regression: test-cases
```

For a request, I start with the UI entry point, follow its API calls, then find the data source. This avoids searching every repository immediately and reduces the chance of changing an obsolete interface.

Branches work the same way. The registry maps roles such as development baseline, testing and production to actual branch names. Scripts resolve those roles; a branch named `master` is not automatically assumed to be production.

Readable project documentation is generated from that registry and checked for consistency. Maintaining one source of truth is easier than keeping separate project tables in README files, Skills and conversations.

Whether registry data belongs in Git depends on who can access the repository. An internal team can share necessary project metadata, while passwords, private keys and tokens stay in private local configuration. Public examples also need internal addresses, real paths and business details removed.

## Give AI a reading order

My entry file contains a few core constraints and routes to more specific rules, rather than every rule in full.

The general reading order is:

1. Read the aggregate workspace README to understand the directories and project relationships.
2. Read the rules for the current activity: development, investigation, data processing or delivery.
3. Read the relevant Skill when a specific business workflow applies.
4. Read the target project's README and development rules before working inside it.

The aggregate layer explains where to go and which workflow to follow. The project layer explains how to write, build and verify its code.

Repeatable procedures belong in Skills: how to trace a particular kind of cross-project request, which evidence to inspect first, or what to check before delivery. Short instructions with clear inputs and outputs remain prompt templates.

When I change conversations or AI tools, this gives the next session context it can read again.

## Isolate concurrent work with a fixed workspace pool

Separate conversations alone do not prevent code changes from interfering with each other. I use a fixed pool and assign each task an exclusive slot:

```text
workspace-pool/
├── ws-01/                      # Task A: add a search filter
│   ├── web-app/
│   ├── api-service/
│   └── data-service/
├── ws-02/                      # Task B: investigate an API issue
│   ├── web-app/
│   └── api-service/
└── ws-03/                      # Available for the next task
```

These directories are created with Git worktrees. Each has a separate working directory while sharing Git objects with its source repository. A pool can contain every project or only a subset frequently used together.

A task spanning several repositories works in the corresponding directories within one slot. Another task uses a different slot. Concurrent tasks in the same repository need distinct task branches; the same branch cannot simply be checked out in multiple worktrees at once.

Why reuse fixed slots? Mainly to preserve local build preparation.

Frontend `node_modules`, Java `target` directories, Gradle caches and IDE indexes all take time to recreate. Releasing a slot preserves those caches, while code and branches are prepared for the next task.

That also means a reused directory does not automatically contain valid dependencies or build output. Dependency changes still require installation, and a clean rebuild is sometimes necessary.

The pool manifest records slot ownership. Management scripts use a file lock and atomic writes to coordinate allocation. An occupied requested slot produces a conflict; an exhausted pool requires releasing completed work or expanding capacity. The workflow does not quietly create another directory to bypass allocation checks.

## Use different modes for development and investigation

I distinguish two ways of using a slot:

| Mode | Behavior |
| --- | --- |
| Development | Create or resume a task branch from a confirmed baseline, then develop and verify changes |
| Investigation | Fetch the target remote branch, freeze a specific commit, and inspect it with detached HEAD |

Freezing the commit makes investigation evidence traceable to a particular version. If synchronization fails, old local code must not be treated as the current environment.

Reading remote logs, databases or existing documents does not always require a code slot. Reading, compiling or comparing local business code does.

Once an investigation identifies a problem, formal changes start by releasing that investigation slot and preparing a development branch. Finding the cause and authorizing a fix are separate steps.

These examples use **my own management scripts** and generic project names. They are not commands supplied by an off-the-shelf tool:

```powershell
# Inspect pool allocation
python scripts/task.py workspace list

# Allocate a workspace for a registered investigation task
python scripts/task.py workspace acquire investigate-query --project api-service --mode Investigation

# Allocate a workspace after development authorization and stage checks
python scripts/task.py workspace acquire add-filter --project web-app --project api-service --mode Development --fetch
```

The commands also validate task state, project scope and branch configuration. Copying the final command does not bypass those prerequisites.

## Keep progress in task records

After separating the working directories, I still need to know where each task stands.

If that information lives only in conversations, it is easy to forget which task was pushed, which is waiting for testing, and which branch needs further work.

Business requests that span conversations therefore get independent Task records. At minimum, they contain an ID, the affected projects, current status and phase, next step, artifact locations, and workspace, branch and commit information.

My current workflow has these phases:

```text
Intake -> Analysis -> Solution -> Authorization -> Development
       -> Local verification -> Review -> Delivery -> Environment testing -> Completed
```

The default is to analyze the request, collect its materials and produce a proposal. Development starts after explicit authorization is recorded. When waiting for a person or an external system, the task keeps its phase and records that waiting status.

Advancing a phase requires more than changing a field. Local verification needs commands and results. Delivery needs concrete commits and remote branches. Completion requires test acceptance, handover materials and a workspace release record.

Some checkpoints also need human approval, including the proposal, code review and test acceptance. Approval is tied to a fingerprint of the artifact reviewed. If the artifact changes, approval must be renewed, so an old proposal cannot silently authorize delivery of different content.

When testing finds a problem, the task's saved branch and baseline restore the working context. If its original slot has been released, the workflow can allocate another slot and resume the same feature branch instead of starting an unrelated line of changes.

Before releasing a workspace, scripts check for uncommitted or unpushed changes. Investigation mode also checks the frozen baseline. Releasing a slot preserves caches; completing a task is a separate action. An available directory does not mean the business change passed acceptance.

## Separate code directories still share runtime resources

An easy point to miss: **two Git worktrees do not automatically create two runtime environments.**

Two frontend tasks can still compete for the same port. Two tasks using the same test database can still affect each other's data. Shared testing branches, deployment and database changes also need coordination.

The pool isolates the code working context. Running that code still requires choosing environments, allocating ports and coordinating shared resources.

Slot ownership only constrains operations that use the management scripts. People or tools that edit directories directly can still disturb the working context. Everyone needs to follow the workflow, and scripts need to recheck state before important operations.

## Make temporary materials easy to find

Concurrent tasks quickly scatter requirements, SQL, logs and test results. I keep each request's materials together:

```text
runtime/
└── 20261021/
    └── add-filter/
        ├── source.md           # Requirement source
        ├── attachments/        # Original attachments
        ├── solution/           # Technical proposal
        └── run-001/            # Commands, logs and results for one run
```

Long-running commands also record a run ID, status and exit code. If no result appears, I first check whether the previous process is still alive before rerunning it.

Requirement materials and runtime output stay out of Git by default. Knowledge worth reusing is later distilled into rules, Skills or project documentation, keeping lasting guidance separate from one task's working files.

## How I would build this incrementally

These rules fit the multi-repository, concurrent-task workflow I currently have. Someone maintaining one or two small projects does not need every phase and approval gate from the start.

I would begin with these steps:

1. Create an aggregate directory and document project responsibilities, entry points and common commands.
2. Add a project registry and call chains to reduce repeated explanations and navigation mistakes.
3. Introduce separate working directories and allocation records when concurrent editing becomes necessary.
4. Add task records and recovery workflows when work spans conversations and testing rounds.
5. Move repeatedly missed checks from reminders into scripts.

That last step matters to me. A rule saying “do not switch the wrong branch” helps; checking the branch and uncommitted changes before allocation is more dependable. Likewise, requiring test-acceptance evidence is more useful than simply writing “test before completing.”

This setup has maintenance costs. Registries need updating, rules must stay consistent, the pool consumes disk space, and someone still needs to examine verification results. It cannot decide whether a requirement is right or whether code actually meets the business need.

But with project relationships, task state and code working contexts made explicit, AI can work continuously within a more predictable scope. Spending less time repeating context and untangling mixed changes is already worthwhile for me.
