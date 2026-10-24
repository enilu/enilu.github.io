---
source_sha256: 70480ff515331aad0210e83566f4e8f0bfe33c17468197c15796279c9dafdc72
title: Chinese Tokenization with IKAnalyzer
date: '2015-12-08'
lang: en
translation_key: ikanalyzer-chinese-tokenization
permalink: /en/2015/12/08/ikanalyzer-chinese-tokenization/
description: Chinese search requires converting continuous text into indexable terms. IKAnalyzer dictionaries and segmentation strategies affect results. Integration therefore needs to verify business terms, rather than merely make the code run.
---

Chinese search requires converting continuous text into indexable terms. IKAnalyzer dictionaries and segmentation strategies affect results. Integration therefore needs to verify business terms, rather than merely make the code run.
<!--break-->

## Confirm the implementation and dependencies

IK Analyzer 2012FF and later IK projects targeting different Lucene or Elasticsearch versions are not interchangeable packages. This example uses the early standalone core API. A locally installed Maven coordinate does not establish that a matching release exists in a public repository.

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

Put this method fragment in your own class and include the matching IK library. The second argument usually represents useSmart: true selects smart segmentation, while false produces finer segmentation. It should not be reduced to a maximum-word-length setting.

## Follow the Lucene stream protocol

When integrating through IKAnalyzer, use an implementation matching the Lucene major version. Consume TokenStream by calling reset, repeatedly calling incrementToken, then end and finally close. Close a reused Analyzer when its owning component finishes.

`reset()` is a method call, not `ts.reset`. Missing end or close can leave offsets, filter state or resource cleanup incomplete. Adding reset alone does not resolve every version compatibility problem.

## Evaluate real business terms

Prepare company names, abbreviations, numbers, mixed Chinese and English, and ambiguous terms. Compare tokens and positions. Track custom dictionary encoding, load paths, loading time and version. Changing indexing analysis does not automatically retokenize an existing index.

Usually the relevant index must be rebuilt and query analysis aligned. More tokens are not necessarily better. Assess recall and precision with representative searches rather than token counts alone.

**References**

- [Lucene Analyzer API](https://lucene.apache.org/core/)
- [IK projectsource](https://github.com/wks/ik-analyzer)
