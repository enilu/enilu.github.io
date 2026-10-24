---
source_sha256: bda490da3323ae18285b4f9cef2653baec06ee743bb25e60b9dd418ffb343802
title: Pushing One Git Project to Multiple Repositories
date: '2019-08-27'
lang: en
translation_key: git-multiple-remotes
permalink: /en/2019/08/27/git-multiple-remotes/
description: When an open-source project needs repositories on both GitHub and Gitee, configure separate remotes or multiple push URLs on one remote. The choice mostly depends on whether you need to inspect each repository's state independently.
---

When an open-source project needs repositories on both GitHub and Gitee, configure separate remotes or multiple push URLs on one remote. The choice mostly depends on whether you need to inspect each repository's state independently.
<!--break-->

## Keep two independent remotes

Assume GitHub is the existing origin and master is the example branch. Use your actual branch when running these commands:

```text
git remote -v
git remote add gitee git@gitee.com:enilu/material-admin.git
git push origin master
git push gitee master
```

Independent remotes make separate fetches, branch inspection and retries straightforward. Authenticate with SSH keys or a credential manager. Keep passwords and access tokens out of repository URLs so they do not appear in configuration, shell history or logs.

`-u` establishes a branch's upstream; it is unnecessary on every push. Usually keep one explicit upstream and push to the other remote explicitly.

## Configure multiple push URLs on origin

If every normal push should reach both repositories, list the push targets explicitly while retaining one fetch source:

```text
git remote set-url --add --push origin git@github.com:enilu/material-admin.git
git remote set-url --add --push origin git@gitee.com:enilu/material-admin.git
git remote get-url --all --push origin
git push origin master
```

These commands assume no custom push URLs exist yet. Inspect existing configuration first to avoid duplicates. Once push URLs are set, list every desired destination. Do not assume the fetch URL remains an additional implicit push target.

## Multiple pushes are not one transaction

If one target succeeds and another fails, Git does not undo the successful push. Preserve that result, investigate the failure and retry the missing destination. Do not hide divergent history with a force push.

If both platforms accept independent commits, their histories may diverge. Designate a primary collaboration repository and define merge and synchronization direction. Push tags according to the release process. Git commits do not synchronize platform issues, attachments, permissions or other metadata.

Multiple remotes reduce repetitive work, but every destination's result still needs checking. Running the command does not prove that all repositories are synchronized.

**References**

- [git remote](https://git-scm.com/docs/git-remote)
- [git push](https://git-scm.com/docs/git-push)
