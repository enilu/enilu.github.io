---
layout: post
category : 爬虫 
tags : [开源,java,数据抓取,jsoup,入门教程]
description: "Jsoup 可以将 HTML 解析成 Document，再用 DOM 方法或 CSS 选择器提取数据。它也提供 HTTP 请求能力，但不会像浏览器一样执行页面 JavaScript，因此服务器返回的 HTML 与浏览器最终显示的内容可能不同。"
lang: zh-CN
translation_key: jsoup-html-parsing
---

Jsoup 可以将 HTML 解析成 Document，再用 DOM 方法或 CSS 选择器提取数据。它也提供 HTTP 请求能力，但不会像浏览器一样执行页面 JavaScript，因此服务器返回的 HTML 与浏览器最终显示的内容可能不同。
<!--break-->

{% include JB/setup %}

## 先用固定 HTML 验证解析逻辑

下面只依赖 Jsoup，适合在项目中固定依赖版本后直接运行：

```java
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

public class LinkExtractor {
    public static void main(String[] args) {
        String html = "<div id='content'><a href='/docs'>文档</a></div>";
        Document doc = Jsoup.parse(html, "https://example.com/");
        for (Element link : doc.select("#content a[href]")) {
            System.out.println(link.text());
            System.out.println(link.attr("abs:href"));
        }
    }
}
```

输出文本“文档”和 `https://example.com/docs`。`text()` 返回文本内容，`html()` 返回元素内部 HTML，`attr("href")` 保留原属性，`abs:href` 则根据基准 URL 解析相对地址。没有有效基准地址时，不应假定一定能得到绝对链接。

## 获取网络响应

```java
Document doc = Jsoup.connect("https://example.com/")
        .timeout(5000)
        .get();
```

网络请求需要处理 IOException，并根据目标服务约定配置超时与会话。设置 User-Agent 或 Cookie 并不会让 Jsoup 获得浏览器脚本执行能力。如果内容来自另一个接口，应确认其访问规则后请求该数据源；确实依赖渲染时，再选择浏览器自动化工具。

## 选择器与缺失值

`#content a[href]` 表示在指定容器中选择具有 href 属性的链接。尽量选择有业务意义的属性或结构，避免完全依赖第几个子节点；页面增加一个广告节点就可能改变位置。

`selectFirst` 找不到元素会返回 null，后续取值前要检查。缺失值、空文本和解析失败应是不同状态，否则数据质量问题会隐藏在空字符串中。

测试可以使用固定 HTML 覆盖缺失容器、相对链接、HTML 实体和嵌套标签。网络变化与解析规则分开测试，定位问题会更直接。

参考：[Jsoup Cookbook](https://jsoup.org/cookbook/)、[CSS 选择器](https://jsoup.org/cookbook/extracting-data/selector-syntax)。
