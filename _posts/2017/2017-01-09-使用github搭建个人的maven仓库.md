---
layout: post
category : 开发工具
keywords: "开发工具"
description: "记录将 Maven 构件 deploy 到本地目录、上传 GitHub 仓库并在项目中声明远程仓库的过程，保留原文参考和当时的配置方式，作为个人构件托管实践。"
tags : [github]
title: "用 GitHub 托管 Maven 仓库：本地 deploy 与项目引用"
---

发现一个github很有用的方法，使用github搭建个人的maven仓库
[原文地址](http://blog.csdn.net/hengyunabc/article/details/47308913)

下面记录下自己的搭建过程 ，备忘下。

<!--break-->

{% include JB/setup %}


将项目deploy本地目录：
mvn deploy -DaltDeploymentRepository=enilu-mvn-repo::default::file:/e:\enilu.github.repo\

在github创建项目，名称为maven-repo 仓库地址为：https://github.com/enilu/maven-repo.git

将上述目录e:\enilu.github.repo\目录下的内容上传到github

在项目中添加下面仓库地址：

    <repositories>
        <repository>
            <id>enilu-maven-repo</id>
            <url>https://raw.githubusercontent.com/enilu/maven-repo/master/repository</url>
        </repository>
    </repositories>
