---
layout: post
category : java 
keywords: "开源,搜索,ikanalyzer,入门教程"
description: "中文检索需要先把连续文本转换成适合索引的词。IKAnalyzer 的词典和切分策略会影响搜索结果，因此接入时不只要让代码能运行，还要检查业务术语被切成了什么。"
tags : [开源,搜索,ikanalyzer,入门教程]
lang: zh-CN
translation_key: ikanalyzer-chinese-tokenization
---

中文检索需要先把连续文本转换成适合索引的词。IKAnalyzer 的词典和切分策略会影响搜索结果，因此接入时不只要让代码能运行，还要检查业务术语被切成了什么。
<!--break-->

{% include JB/setup %}

## 先确认所用实现与依赖

IK Analyzer 2012FF 系列与后来面向不同 Lucene、Elasticsearch 版本的 IK 项目不是可以任意互换的同一个包。本文使用早期独立 IK 核心 API 说明切词，不把本地安装的 Maven 坐标当成公共仓库里一定存在的发行物。

```java
import java.io.IOException;
import java.io.StringReader;
import org.wltea.analyzer.core.IKSegmenter;
import org.wltea.analyzer.core.Lexeme;

public static void printWords(String text) throws IOException {
    IKSegmenter segmenter = new IKSegmenter(new StringReader(text), true);
    Lexeme word;
    while ((word = segmenter.next()) != null) {
        System.out.println(word.getLexemeText());
    }
}
```

这是方法片段，需放入自己的类中，并引入匹配版本的 IK 库。第二个参数通常表示 useSmart：true 使用智能切分，false 使用较细粒度切分，不应仅按“最大词长”理解。

## 使用 Lucene Analyzer 时遵守流协议

若通过 IKAnalyzer 接入 Lucene，应使用与 Lucene 主版本匹配的实现。消费 TokenStream 的流程是 reset、循环 incrementToken、end，最后 close；可复用 Analyzer 也要在拥有它的组件结束时关闭。

`reset()` 是方法调用，不能写成 `ts.reset`。遗漏 end 或 close 可能让偏移、过滤器状态和资源释放不完整，不是加一行 reset 就解决所有版本兼容问题。

## 用业务词检查效果

准备企业名、缩写、数字、混合中英文和歧义词样本，比较切分结果及位置。自定义词典的编码、加载路径、加载时机和版本要可追溯；索引端改变分词规则后，已有索引不会自动按新规则重新切词。

通常需要重建相关索引，并同步查询端分析方式。词切得更多不一定更好：召回与精确度需要通过实际查询样本评估，而不是只看输出词数。

参考：[Lucene Analyzer API](https://lucene.apache.org/core/)、[IK 项目源码](https://github.com/wks/ik-analyzer)。
