---
source_sha256: 32e9429323c461d9c95a47aa357348cf80b2095464d0dc30a36f78822c2d7303
title: Running a Jekyll Blog Locally on Windows
date: '2017-01-25'
lang: en
translation_key: jekyll-windows-local-preview
permalink: /en/2017/01/25/jekyll-windows-local-preview/
description: Local Jekyll preview helps catch Chinese-path, code-formatting and configuration problems before publication. On Windows, the key is keeping Ruby, build tools, Bundler and project dependencies aligned.
---

Local Jekyll preview helps catch Chinese-path, code-formatting and configuration problems before publication. On Windows, the key is keeping Ruby, build tools, Bundler and project dependencies aligned.
<!--break-->

## Prepare the project's Ruby environment

Install RubyInstaller with Devkit and initialize the MSYS2 toolchain required by the project. This differs from the separate DevKit workflow used with early Ruby 2.0; do not combine them.

Inspect Gemfile and Gemfile.lock in the project directory, then install dependencies:

```text
ruby --version
bundle --version
bundle install
```

If the lockfile requires a particular Bundler version, install it first and use the `bundle _version_ ...` form. For native-extension failures, inspect the failing dependency and compiler setup instead of reinstalling repeatedly.

## Start preview with project dependencies

```text
bundle exec jekyll serve --host 127.0.0.1 --port 4000
```

Open `http://127.0.0.1:4000/`. bundle exec selects the resolved project gems and avoids differences from a globally installed jekyll. Changes to _config.yml generally require restarting; article edits trigger the watcher.

## Handle Chinese paths and encoding

Save source files as UTF-8 and inspect terminal, Ruby and dependency encoding settings. In PowerShell, set this before starting:

```powershell
$env:RUBYOPT = '-EUTF-8:UTF-8'
bundle exec jekyll serve --host 127.0.0.1 --port 4000
```

If the homepage works but Chinese article paths fail, retain the exact path and error log, check that output exists, and investigate URL encoding or filesystem compatibility. A supported Ruby/Jekyll combination is easier to maintain than directly patching WEBrick's path-handling source.

## Check both builds and page access

```text
bundle exec jekyll build
```

Visit articles with Chinese filenames, code blocks and many images. Verify links and resources. A server running message does not establish that every page works.

**References**

- [Jekyll on Windows](https://jekyllrb.com/docs/installation/windows/)
- [RubyInstaller](https://rubyinstaller.org/)
