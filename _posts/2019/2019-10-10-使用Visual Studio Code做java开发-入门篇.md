---
layout: post
category : 开发工具
keywords : "VS Code,开发工具"
description : "使用Visual Studio Code进行java开发-入门资源篇"
tags : [vs code,开发工具,java开发]
---

最近在尝试用vscode做java开发，主要是想把家里的4G内存的mac本本用起来，使用IDEA打开有点慢，所以打算用vscode做开发。下面文章主要记录使用vscode做java开发过程中主要涉及到的插件，资源，配置；并不会一步步的教你入门；毕竟网上资料太多了。

本文章会不定时更新
<!--break-->

{% include JB/setup %}


## 必装插件
- Java Extension Pack,该插件包含了下面插件，所以安装该插件后不必重复安装下面插件
  - Language Support for Java(TM) by Red Hat  代码导航，自动补全，重构，代码片段等
  - Debugger for Java 不解释
  - Java Test Runner 运行和调试JUnit的测试用例。
  - Maven for Java  对Maven的支持。
  - Java Dependency Viewer 浏览查看当前Java工程的所有依赖情况。
- Spring Boot Extension Pack 开发Spring Boot应用程序必备，作为java程序员Spring Boot是绕不过去的坎

## 配置
- 配置java home和maven
  - 打开设置窗口，搜索jdk，编辑settings.json，
  ![search_search]({{ site.img_url }}/2019/10/vscode_java_settings.jpg)
  - 在settings.json文件中添加下面内容,你根据你得实际安装目录调整具体值即可
  ```xml
  "java.home":"D:\\Program\\jdk1.8.0_201",
  "java.configuration.maven.userSettings": "D:\\Program\\maven-3.6.0\\conf\\settings.xml",
  ```

## 扩展插件

- IntelliJ IDEA Keybindings 如果你之前用IntelliJ IDEA开发工具，那么这个插件必装
- Lombok Annotations Support for VS Code，Lombok插件，可以方便的帮助我们生成setter,getter方法等
- Vetur，本片虽然是介绍用vscode做java开发，但是作为免不了写前端的后端程序员，我用vue.js，所以这款vuejs的插件必不可少

## 快捷键
-  ctrl + alt +B 进入当前接口(方法)的实现类(方法)
