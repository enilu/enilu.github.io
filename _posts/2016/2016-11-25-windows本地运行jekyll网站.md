---
layout: post
category : 学习笔记
keywords: "jekyll,个人网站"
description : "windows上搭建jekyll网站"
tags : [教程]
---

用github pages做个人站点有一段时间了，用的是jekyll的一个模版[jekyll-bootstrap](https://github.com/plusjade/jekyll-bootstrap)。
之前一直没有在本地运行起来，最近出差晚上实在无聊，就在本地跑起来咯。

先说参考文档：[http://jekyll-windows.juthilo.com/](http://jekyll-windows.juthilo.com/)。
照着上面步骤做，基本没什么问题，我下面除了再重复下文档中的步骤以外，再记录下期间遇到的坑。

<!--break-->

{% include JB/setup %}

## 安装ruby
好吧，这个没什么说的，自己下载安装吧

## 安装DevKit-mingw64
- 安装也没什么书odel，下载后加压，假设解压到目录：cd C:\RubyDevKit

- 执行面两个命令：

        ruby dk.rb init //初始化生成配置文件
        ruby dk.rb install //安装

### 安装jekyll gem

- 执行命令：

    gem install jekyll

注意：这里由于网络原因可能会安装失败，多试几次，拼人品的时候到了，不行就用代理**


### 运行网站

- 假设你的个人站点在d:\\mywebsite
- dos窗口进入上面目录，执行命令：

    jekyll serve

- 访问：http://127.0.1:4000

### 解决乱码问题

- 我这里打开http://127.0.1:4000首页显示没有问题，点击网站以后进入，报错，jekky使用中文标题做url但是编码问题导致无法访问。

**解决方法：**

- 修改${ruby_home}\lib\ruby\2.0.0\webrick\httpservlet\filehandler.rb文件265行，prevent_directory_traversal方法中
- 注释掉：

	    # path = req.path_info.dup.force_encoding(Encoding.find("filesystem"))

- 增加：

        path = req.path_info.dup.force_encoding(Encoding.find("filesystem"))
        puts "path:#{path}---#{path.encoding}"
        #change the path encoding interpreter
        path.force_encoding('UTF-8')
        puts "path:#{path}---#{path.encoding}"


- set_filename 方法中：

        res.filename = @root.dup

- 更改为：

        puts "system encoding: #{Encoding.find("filesystem")}"
        res.filename = @root.dup
        puts "res.filename encoding:#{res.filename.encoding}"
        puts "req.path_info.encoding:#{req.path_info.encoding}"

- 并在：

        break if base == "/"

- 后面增加：

        base.force_encoding("UTF-8")

- 最后为：

          def set_filename(req, res)
            puts "system encoding: #{Encoding.find("filesystem")}"
            res.filename = @root.dup
            puts "res.filename encoding:#{res.filename.encoding}"
            puts "req.path_info.encoding:#{req.path_info.encoding}"
            path_info = req.path_info.scan(%r|/[^/]*|)

            path_info.unshift("")  # dummy for checking @root dir
            while base = path_info.first
              break if base == "/"
              base.force_encoding("UTF-8")
              break unless File.directory?(File.expand_path(res.filename + base))
              ......

### 附上相关软件及其版本

上面问题都是基于下面软件和版本执行的：
 - [Ruby 2.0.0-p648 (x64)](http://dl.bintray.com/oneclick/rubyinstaller/rubyinstaller-2.0.0-p648-x64.exe)
 - [DevKit-mingw64-64-4.7.2-20130224-1432-sfx.exe](http://dl.bintray.com/oneclick/rubyinstaller/DevKit-mingw64-64-4.7.2-20130224-1432-sfx.exe)
 - [jekyll-bootstrap](https://github.com/plusjade/jekyll-bootstrap)

