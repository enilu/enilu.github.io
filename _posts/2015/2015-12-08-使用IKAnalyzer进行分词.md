---
layout: post
category : 搜索 
keywords: "开源,搜索,ikanalyzer,入门教程"
description : " IKAnalyzer是一个开源的，基于java语言开发的轻量级的中文分词语言包，它是以Lucene为应用主体，结合词典分词和文法分析算法的中文词组组件。 从3.0版本开始，IK发展为面向java的公用分词组件，独立Lucene项目，同时提供了对Lucene的默认优化实现。 IKAnalyzer实现了简单的分词歧义排除算法，标志着IK分词器从单独的词典分词想模拟语义化分词衍生。"
tags : [开源,搜索,ikanalyzer,入门教程]
---
   
   IKAnalyzer是一个开源的，基于java语言开发的轻量级的中文分词语言包，它是以Lucene为应用主体，结合词典分词和文法分析算法的中文词组组件。 从3.0版本开始，IK发展为面向java的公用分词组件，独立Lucene项目，同时提供了对Lucene的默认优化实现。 IKAnalyzer实现了简单的分词歧义排除算法，标志着IK分词器从单独的词典分词想模拟语义化分词衍生。 
<!--break-->

{% include JB/setup %} 

mvnrepository 中没有ikanalyzer ，所有需要自己下载ik的jar包安装，我下载的版本是：IK Analyzer 2012FF_hf1.zip，解压后，将其中的jar包安装到本地仓库：
    
    mvn install:install-file -Dfile=/home/IKAnalyzer2012FF_u1.jar -DgroupId=org.wltea.ik-analyzer -DartifactId=ik-analyzer -Dversion=2012FF_u1 -Dpackaging=jar
    
然后在pom.xml中添加： 

    <dependency>
        <groupId>org.wltea.ik-analyzer</groupId>
        <artifactId>ik-analyzer</artifactId>
        <version>2012FF_u1</version>
    </dependency>

分词代码：   
       
    public static  List<String> splitWord(String text, boolean isMaxWordLength) {
        List<String> result = Lists.newArrayList();
        try {
            // 创建分词对象
            Analyzer analyzer = new IKAnalyzer(isMaxWordLength);
            StringReader reader = new StringReader(text);
            // 分词
            TokenStream ts = analyzer.tokenStream("", reader);
            ts.reset();
            CharTermAttribute term = ts.getAttribute(CharTermAttribute.class);
            // 遍历分词数据

            while (ts.incrementToken()) {
                result.add(term.toString());
            }
            reader.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }
   

注意网上好多代码，都没有下面这一行代码:
        
    ts.reset;

老版本没有这行代码，新版本没有这行会报错：

    java.lang.IllegalStateException: TokenStream contract violation: reset()/close() call missing, reset() called multiple times, or subclass does not call super.reset(). Please see Javadocs of TokenStream class for more information about the correct consuming workflow.  
        at org.apache.lucene.analysis.Tokenizer$1.read(Tokenizer.java:111)  
        at java.io.Reader.read(Reader.java:140)  
        at org.wltea.analyzer.core.AnalyzeContext.fillBuffer(AnalyzeContext.java:124)  
        at org.wltea.analyzer.core.IKSegmenter.next(IKSegmenter.java:122)  
        at org.wltea.analyzer.lucene.IKTokenizer.incrementToken(IKTokenizer.java:78)  
        
新版本分词流程参考这里：[http://lucene.apache.org/core/3_0_3/api/core/org/apache/lucene/analysis/TokenStream.html](http://lucene.apache.org/core/3_0_3/api/core/org/apache/lucene/analysis/TokenStream.html)

     The workflow of the new TokenStream API is as follows:
    
        Instantiation of TokenStream/TokenFilters which add/get attributes to/from the AttributeSource.
        The consumer calls reset().
        The consumer retrieves attributes from the stream and stores local references to all attributes it wants to access.
        The consumer calls incrementToken() until it returns false consuming the attributes after each call.
        The consumer calls end() so that any end-of-stream operations can be performed.
        The consumer calls close() to release any resource when finished using the TokenStream. 










