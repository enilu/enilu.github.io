---
layout: post
category : 学习笔记 
keywords: "nutz,源码学习"
description : ""
tags : [nutz,源码学习]
---
 
先来通过一个测试用例看看httpclient这个极简的库是如何工作的：

      Response response = Http.get("http://nutztest.herokuapp.com/");          
      System.out.println(response.getContent());
  
这中间的调用链是：

        Http.get(url)
        ---->Sender.create(Request.get(url)).send()
        ---------------------->Request.create(url, METHOD.GET, new HashMap<String, Object>())
        ------------------------------>return new Request().setMethod(method).setParams(params).setUrl(url).setHeader(header);
        -------->new GetSender(request)
        ---------------------------------------->openConnection()
        ---------------------------------------->setupRequestHeader()
        ---------------------------------------->createResponse()
        -------------------------------------------->status = conn.getResponseCode();
        -------------------------------------------->detail = conn.getResponseMessage();
 
- Http是入口类，直接调用get方法传入url，即可获得Response对象，
- 接下来是一个比较核心的对象Sender类，该类用于发送请求，根据请求方式具体有GetSender和PostSender两个子类。
- Sender类方法的主要功能是根据传入的参数构造Request请求，并且打开连接（OpenConnection），底层是调用Url的openConnection。
- 然后调用send方法返回Response对象，send方法由子类GetSender和PostSender具体实现。上面例子中调用的是GetSender类的send方法。
- send方法中调用三个方法openConnection（打开连接），setupRequestHeader(设置请求头信息），createResponse(获取Reponse对象）。
- 其实这三个方法都是调用父类Sender中封装的方法。后面会介绍其实PostSender类的send方法中也是这么调用的，只不过传递参数的时候有一些特殊处理。

其实Httpclient的核心实现就是这些，其他主要是一些特殊情况的处理。
比如cookie的管理，post请求的处理，带文件的post请求处理。超时处理，代理的使用等等。

再次赞一下，nutz的测试用例挺的，看代码直接从测试用例一步步跟进去，可以很快的了解和掌握框架。强烈推荐。
这次就打算用测试用例来一步步阅读源码，这次概览顺便把get请求过了一遍，下次就以测试用例的post请求，超时来阅读学习。
<!--break-->

{% include JB/setup %}