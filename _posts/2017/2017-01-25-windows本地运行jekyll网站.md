---
layout: post
category : 学习笔记
keywords: "jekyll,个人网站"
description: "维护 Jekyll 博客时，本地预览可以提前发现中文路径、代码排版和配置问题。Windows 环境的关键是让 Ruby、构建工具、Bundler 和项目依赖保持一致。"
tags : [教程]
lang: zh-CN
translation_key: jekyll-windows-local-preview
---

维护 Jekyll 博客时，本地预览可以提前发现中文路径、代码排版和配置问题。Windows 环境的关键是让 Ruby、构建工具、Bundler 和项目依赖保持一致。
<!--break-->

{% include JB/setup %}

## 准备项目使用的 Ruby 环境

安装带 Devkit 的 RubyInstaller，并按项目版本完成 MSYS2 工具链初始化。带 Devkit 的 RubyInstaller 与早期 Ruby 2.0 的独立 DevKit 流程不同，不要混用。

在项目目录检查 Gemfile 与 Gemfile.lock，再安装依赖：

```text
ruby --version
bundle --version
bundle install
```

如果 lockfile 要求特定 Bundler，先安装相应版本，再使用 `bundle _版本号_ ...`。原生扩展编译失败时查看具体依赖和编译工具，而不是只反复安装。

## 用项目依赖启动预览

```text
bundle exec jekyll serve --host 127.0.0.1 --port 4000
```

访问 `http://127.0.0.1:4000/`。bundle exec 保证使用项目解析出的 gem，避免全局 jekyll 与项目版本不同。修改 _config.yml 后通常需要重启，文章修改则由监听器触发生成。

## 中文路径与编码

源文件保存为 UTF-8，并检查终端、Ruby 和依赖的编码环境。PowerShell 可以在启动前设置：

```powershell
$env:RUBYOPT = '-EUTF-8:UTF-8'
bundle exec jekyll serve --host 127.0.0.1 --port 4000
```

首页正常但中文文章失败时，保存具体路径和错误日志，检查构建产物是否存在，再定位 URL 编码或文件系统兼容问题。使用项目支持的 Ruby/Jekyll 组合，比直接修改 WEBrick 路径处理源码更容易维护。

## 构建和访问都要检查

```text
bundle exec jekyll build
```

构建后访问几篇中文文件名、代码块和图片较多的文章，检查互链与资源。终端显示 server running，不等于网站所有页面都正确。

参考：[Jekyll on Windows](https://jekyllrb.com/docs/installation/windows/)、[RubyInstaller](https://rubyinstaller.org/)。
