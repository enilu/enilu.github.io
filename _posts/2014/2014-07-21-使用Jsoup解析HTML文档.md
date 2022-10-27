---
layout: post
category : 爬虫 
tags : [开源,java,数据抓取,jsoup,入门教程]
---

Jsoup是一款开源的抓取和解析网页的java组件，它可以很方便的对静态html进行解析，也可以方便的根据URL获取动态的页面内容，支持POST和get方式请求，而且支持参数的传递。其设计非常简单易用，毫无学习压力。 
<!--break-->

{% include JB/setup %}

解析和遍历html：

    String html = "  Parsed HTML into a doc.  ";
        Document doc = Jsoup.parse(html);


    根据URL加载一个Document对象：


    Document doc = Jsoup.connect("http://example.com/").get();

    使用POST方式请求加载一个Document对象：

    Document doc = Jsoup.connect("http://example.com")
    .data("query", "Java")
    .userAgent("Mozilla")
    .cookie("auth", "token")
    .timeout(3000)
    .post();

    根据一个文件加载一个Document对象：

    File input = new File("/tmp/input.html");
    Document doc = Jsoup.parse(input, "UTF-8", "http://example.com/");


    将HTML解析成一个Document之后，就可以使用类似于DOM的方法进行操作。示例代码：

    File input = new File("/tmp/input.html");
    Document doc = Jsoup.parse(input, "UTF-8", "http://example.com/");

    Element content = doc.getElementById("content");
    Elements links = content.getElementsByTag("a");
    for (Element link : links) {
        String linkHref = link.attr("href");
        String linkText = link.text();
    }

    说明

    Elements这个对象提供了一系列类似于DOM的方法来查找元素，抽取并处理其中的数据。具体如下：

    查找元素

    getElementById(String id)

    getElementsByTag(String tag)

    getElementsByClass(String className)

    getElementsByAttribute(String key) (and related methods)

    Element siblings: siblingElements(), firstElementSibling(), lastElementSibling();nextElementSibling(), previousElementSibling()

    Graph: parent(), children(), child(int index)

    元素数据

    attr(String key)获取属性attr(String key, String value)设置属性

    attributes()获取所有属性

    id(), className() and classNames()

    text()获取文本内容text(String value) 设置文本内容

    html()获取元素内HTMLhtml(String value)设置元素内的HTML内容

    outerHtml()获取元素外HTML内容

    data()获取数据内容（例如：script和style标签)

    tag() and tagName()

    操作HTML和文本

    append(String html), prepend(String html)

    appendText(String text), prependText(String text)

    appendElement(String tagName), prependElement(String tagName)

    html(String value)

- Jsoup封装的解析Document的方法与网页标准的DOM操作非常相似，即使是初次使用基本上靠猜测都快一试出想要的方法和效果。
- 使用Jsoup只需要吧Jsoup的一个jar包加入到项目中即可，最新版本的Jsoup是1.7.3，所以对应的jar包是：jsoup-1.7.3.jar
- 更详细的使用方法参见这里：http://www.open-open.com/jsoup/
- Jsoup的API参见这里：http://jsoup.org/apidocs/