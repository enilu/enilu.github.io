---
source_sha256: 0336a5a12228b4f2530555ae97c6976a7f62c82168dd142da81d5f8faee278f9
title: Parsing and Extracting HTML with Jsoup
date: '2014-07-21'
lang: en
translation_key: jsoup-html-parsing
permalink: /en/2014/07/21/jsoup-html-parsing/
description: Jsoup parses HTML into a Document and extracts data with DOM methods or CSS selectors. It also offers HTTP requests, but does not execute JavaScript like a browser. The server's HTML may therefore differ from the page eventually displayed i
---

Jsoup parses HTML into a Document and extracts data with DOM methods or CSS selectors. It also offers HTTP requests, but does not execute JavaScript like a browser. The server's HTML may therefore differ from the page eventually displayed in a browser.
<!--break-->

## Verify parsing with fixed HTML first

This example depends only on Jsoup. Pin a version in the project before running it:

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

It prints the link text “文档” and `https://example.com/docs`. `text()` returns text, `html()` returns inner HTML, and `attr("href")` returns the original attribute. `abs:href` resolves a relative address against the base URL. Do not assume an absolute link can be obtained without a valid base.

## Retrieve a network response

```java
Document doc = Jsoup.connect("https://example.com/")
        .timeout(5000)
        .get();
```

Handle IOException and configure timeouts and sessions according to the target service. Setting User-Agent or Cookie does not give Jsoup JavaScript execution. If another endpoint supplies the content, establish its access rules before querying it. Choose browser automation when rendering is actually required.

## Handle selectors and missing values

`#content a[href]` selects links with an href inside the named container. Prefer meaningful attributes or structure over child positions, which can shift when an advertisement is inserted.

`selectFirst` returns null when no element matches. Check before accessing values. Missing elements, empty text and parse failures should remain different states; collapsing them into an empty string hides quality problems.

Use fixed HTML tests for missing containers, relative links, entities and nested tags. Testing network changes separately from parser rules makes diagnosis more direct.

**References**

- [Jsoup Cookbook](https://jsoup.org/cookbook/)
- [CSS selectors](https://jsoup.org/cookbook/extracting-data/selector-syntax)
