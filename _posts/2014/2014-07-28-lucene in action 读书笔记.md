---
layout: post
category : 搜索 
tags : [开源,lucene,读书笔记]
---

09年的时候就接触了lucene，可惜一直没有机会在项目中实战，去年终于有机会在项目离使用，可惜由于当时时间紧张，没有好好深入，只是用到什么看什么。最近重新看了下《Lucene In Action》，算是系统的对lucene有个了解，该笔记记录了该书中第一章，主要针对Lucene的基本概念和用法做了描述。
<!--break-->

{% include JB/setup %}
 
<ol>
    <li><p>初识Lucene</p></li>
    <li><p>Lucene的核心功能是建立索引和搜索查询。&nbsp;</p></li>
    <br>
    <li><p>建立索引</p></li>
    <p style="">建立索引也就是：将指定的文本内容， 根据要求建立成一个一个Lucene的Document， 然后通过IndexWriter的writer方法写入到索引结果文件中</p>
    <br>
    <ol style="list-style-type: lower-alpha;"><p style="">

    </p></ol>
</ol>
<p>代码示例:</p>

<p>
    <img src="http://e.hiphotos.bdimg.com/album/pic/item/b3119313b07eca80016a0cd4922397dda1448391.jpg" width="480"></p>

<p>代码示例</p>

<p>
    <img src="http://h.hiphotos.bdimg.com/album/pic/item/c8ea15ce36d3d539e1553af03987e950352ab09c.jpg" width="480"></p>

<p>代码示例</p>

<p>
    <img src="http://b.hiphotos.bdimg.com/album/pic/item/9825bc315c6034a8c7e78db2c8134954092376ff.jpg" width="480"></p>

<p>建立索引的过程用到的核心类： 【IndexWriter】:操作索引的核心类，包括对索引的增加，删除，修改接口
    【Directory】：描述Lucene索引的存放位置，IndexWriter的构造需要该实力 【Analyzer】：负责对要索引的文件进行分析，提取语汇单元
    【Document】：一个Document代表一些域（Field）的集合，代表一个条记录， 比如一个网页，一条数据库记录，或者一个文件
    【Field】：属于一个Document的一个属性，比如一个网页构成的Document应该具备的Field一般至少应包括以下3个Filed：网址,标题，content.<br></p>
<ol>
    <ol style="list-style-type: lower-alpha;">
        <ol>
            <li><p>内容搜索</p>

                <p style="">
                </p></li>
        </ol>
    </ol>
</ol>
<p>代码示例</p>

<p>
    <img src="http://g.hiphotos.bdimg.com/album/pic/item/9d82d158ccbf6c81261918dbbf3eb13533fa40d2.jpg" width="480"></p>

<p>搜索过程的核心类： 【IndexSearcher】：该类提供了连接索引文件的核心方法，通过Directory来实例化
    【Term】：是搜索功能的基本单元，可以理解为一个搜索条件的封装对象，比如Term t = new
    Term("content","山西"),标识构建了一个搜索内容(content)包含“山西”字符的搜索条件
    【Query】：具体的查询类，具备很多子类，来满足各种各样的查询需求，包括TermQuery，BooleanQuery,NumericRangeQuery,SpanQuery,FilteredQuery等等。
    【TermQuery】：是Query的子类，用来查询制定域（Field）包含特定项的文档，和Term结合使用 【TopDocs】：是一个指针容器，一般指向前N个排名的搜索结果。<br></p>
<ol>
    <ol style="list-style-type: lower-alpha;">
        <li><p>构建索引</p>

            <p style="">

            </p></li>
        <ol>
            <li><p>对搜索内容进行建模</p>

                <p style="">
                </p></li>
        </ol>
    </ol>
</ol>
<p>
    文档（Document）和域（Field）Lucene对域（Field）的操作：1，对Field的索引2，对Filed的存储3，在lucenen中对Filed的操作有以下集中搭配，索引且存储，索引不存储，不索引存储灵活的架构<br>
</p>

<p style="">Lucene中Document和Filed的概念非常类似数据库中的表和列。但是实际上有很大的区别：
    Lucenen建立的同一个索引文件中的不同Document可以拥有不同的Filed， 而数据库同一个ibao中必须拥有相同的列</p>
<ol>
    <ol style="list-style-type: lower-alpha;">
        <ol>
            <li><p>构建索引的过程</p>

                <p style="">
                </p></li>
        </ol>
    </ol>
</ol>
<p>提取和创建文档<br></p>

<p style="">一般情况下，对于txt一类的文本文件，我们可以方便的进行读取并使用Lucenen进行索引的建立。
    但是对于PDF，Word，等非纯文本格式的文档，java中并没有直接的API来进行读取操作。 针对这些文档，要么要求开发者自己去找对应的文档解析工具，比如POI之类的。
    本书中也介绍了Tika框架来解析各种各样的文档，详情见第七章</p>

<p>分析文档<br></p>

<p style="">对于文档的分析，重点在于寻找好的分词器，以及去除一些不必要的无意义的词，比如”是，的，了，“英文中的”an ，the,on,
    in,"等等。最终形成有效的实用的文档Document</p>

<p>向索引添加文档</p>
<ol>
    <ol style="list-style-type: lower-alpha;">
        <ol>
            <li><p>基本索引操作</p>

                <p style="">
                </p></li>
        </ol>
    </ol>
</ol>
<p>添加索引添加索引有两个核心的API:
    addDocument(Document):使用默认的分析器分析文档，然后添加到索引文件中addDocument(Document,Analyzer):使用指定的分析器分析文档，然后添加到索引文件中代码示例</p>

<p>
    <img src="http://g.hiphotos.bdimg.com/album/pic/item/0eb30f2442a7d9332e4bd140ae4bd11373f00125.jpg" width="480"></p>

<p>
    删除索引核心接口：deleteDocuments(Term):删除含项的所有文档deleteDocuments(Term[]):删除含项中任意一个元素的所有文档deleteDocuments(Query):删除匹配查询条件的所有文档deleteAll():删除所有文档，
    例子：
    writer.deleteDocuments(newTerm("id","1"));更新索引核心接口：updateDocument(Term,Document):将匹配Term条件的索引记录更新为Document
    updateDocument(Term,Docuemnt,Analyzer):同上，并且对Document使用指定的分析器进行分析<br></p>
<ol>
    <ol style="list-style-type: lower-alpha;">
        <ol>
            <li><p>域（Field）选项</p>

                <p style="">
                </p></li>
        </ol>
    </ol>
</ol>
<p>Field.Index.*，域索引选项</p>

<p>
    <img src="http://c.hiphotos.bdimg.com/album/pic/item/c8177f3e6709c93dcaed3ac49c3df8dcd10054e1.jpg" width="480"></p>

<p>Field.Store.*,域存储选项<br></p>

<p>
    <img src="http://g.hiphotos.bdimg.com/album/pic/item/42166d224f4a20a4700508f493529822720ed0ed.jpg" width="480"></p>

<p style="">Lucene中有个CompressionTools,可以对存储的数据进行压缩 但是，压缩的话会降低索引和搜索速度，所有使用该类需要综合权衡。
    如果，索引内容不是很大，建议不要使用该类。</p>

<p>域选项组合用法：</p>

<p>
    <img src="http://c.hiphotos.bdimg.com/album/pic/item/eaf81a4c510fd9f99d60615a262dd42a2834a489.jpg" width="480"></p>

<p>域排序选项<br></p>

<p style="">Lucene搜索文档的时候默认根据评分对文档进行排序， 如果想根据自定义排序结果，比如搜索邮件的时候希望根据邮件发送日期进行排序。
    则需要在建立索引的时候就进行正确的索引方式。</p>

<p>如果要排序的域是数字型，在必须使用NumbericField来标识。 如果排序的域是字符串型，则要对对其使用Field.Index.NOT_ANALYZED避免分析器对其进行分析。多值域<br>
</p>

<p style="">类似以下应用场景：比如一片文章有多个作者，要求搜索任何一个作者都能搜索到该文章。</p>

<p>String[] authors = { "张三", "李四", "王五" }; Document doc = new Document(); for (String author :
    authors) { doc.add(new Field("author", author, Field.Store.YES, Field.Index.ANALYZED)); }</p>
<ol>
    <ol style="list-style-type: lower-alpha;">
        <ol>
            <li><p>对文档和域加权操作</p>

                <p style="">
                </p></li>
        </ol>
    </ol>
</ol>
<p>文档加权操作<br></p>

<p style="">比如对右键进行建立索引的时候，要求发件人是本公司的员工的右键进行加权 Document.setBoost(float v)，</p>

<p>代码示例</p>

<p>
    <img src="http://e.hiphotos.bdimg.com/album/pic/item/024f78f0f736afc38d4f0b56b019ebc4b7451245.jpg" width="480"></p>

<p>域加权操作用法： Field field = new Field("subject",subject,Field.Store.YES,Field.Index.ANALYZED);
    field.setBoost(1.5f);加权基准（Norms)<br></p>
<ol>
    <ol style="list-style-type: lower-alpha;">
        <li><p>索引数字，日期，时间</p></li>
        <br></ol>
</ol>
<p>索引数字<br></p>

<p style="">索引数字有两种需求： 一种是针对文本字符串中的数字，希望分析器能识别出数字， 并确保将其保存为一个语汇单元，以便检索的能搜索到。
    另一种是一个域只包含数字，希望将其作为数字域来处理</p>

<p>第一种：处理文本中的数字：使用可识别数字的分析器来分析文本即可，WhtespaceAnalyzer和StarndardAnalyzer都支持，
    而SimpleAnalyzer和StopAnalyzer会将语汇单元流中的数字自动剔除第二种：处理数字域：使用NumbericField即可，使用方式示例：doc.add(new
    NumbericField("price").setDoubleValue(19.99));索引日期和时间<br></p>

<p style="">针对日期和时间，lucene中没有类似DateField来处理， 解决方案是将日期或者时间转换为int或者long来处理，比如： doc.add(new
    NumbericField("price").setDoubleValue(date.getTime()));</p>
<ol>
    <ol style="list-style-type: lower-alpha;">
        <li><p>域截取</p></li>
        <p style="">
        </p></ol>
</ol>
<p>域截取是针对过长的文本内容，设置截取的最大单词数免得由于对过大文本进行处理导致的内存失控问题。lucene提供了两个接口来设置域截取的长度： 构造方法：IndexWriter
    indexWriter = new IndexWriter(FSDirectory.open(new File( indexDir)), new
    StandardAnalyzer(Version.LUCENE_30), new MaxFieldLength(6));
    方法：indexWriter.setMaxFieldLength(maxFieldLength);maxFieldLength是每个文档的域中term的最大个数注意：如果设置了域截取的长度，则说明如果存在过大的文档，
    则文档只有前N项才能被检索到，后面的是搜索不到的</p>
<ol>
    <ol style="list-style-type: lower-alpha;">
        <li><p>优化索引</p></li>
        <p style="">
        </p></ol>
</ol>
<p>索引的优化是指对搜索速度的优化，而不是对建立索引速度的优化优化的方式主要是将索引文件的各段合并成一个，或者尽量合并为少量。
    以避免lucene需要在各段中搜索完成后还要进行各段搜索结果的合并。IndexWriter提供了optimize()方法以便在建立索引的时候合并索引段；该通过重载有多种用法注意：优化索引的时候会大连占用磁盘临时控件和CPU，所以如果建立索引和搜索程序在同一台机器上，
    并且需要频繁新建或者更新索引文件的话，要考虑对对搜索体验的影响。 一般建议索引文件的重建最好是定时，且不要太频繁的进行。</p>
<ul style="list-style-type: square;">
    <ol style="list-style-type: lower-alpha;">
        <li><p>常用Directory子类</p></li>
        <br>

        <p style="">Directory类用来对底层索引文件的读写，lucenen提供了多种Directory的子类来满族不同场合的应用</p>

        <p style="">
        </p></ol>
</ul>
<p>
    SimpleFSDirectory：最简单的Directory自来，使用java.io.*进行索引文件的操作，不支持多线程。NIOFSDirectory：使用java.nio.*来保存索引文件，支持多线程操作MMapDirectory：使用内存映射I/O进行文件访问，64位JRE可以使用该方式，32位JRE的话，对较小的索引文件也可以使用该方式RAMDirectory：所有文件都写入内存FileSwitchDirectory：使用两个索引文件目录，可以根据文件扩展名在两个目录之间切换使用一般情况下可以使用FSDirecotry，该类会根据具体操作系统平台来选择合适的Directory，
    参考FSDirecotry.open()的实现： <br></p>

<div>
    <div class="syntaxhighlighter  java">
        <table border="0" cellpadding="0" cellspacing="0">
            <tbody>
            <tr>
                <td class="gutter">
                    <div class="line number1 index0 alt2">1</div>
                    <div class="line number2 index1 alt1">2</div>
                    <div class="line number3 index2 alt2">3</div>
                    <div class="line number4 index3 alt1">4</div>
                    <div class="line number5 index4 alt2">5</div>
                    <div class="line number6 index5 alt1">6</div>
                </td>
                <td class="code">
                    <div class="container">
                        <div class="line number1 index0 alt2"><code>public</code>
                            <code>static</code> <code>FSDirectory open(File path, LockFactory
                                lockFactory) </code><code>throws</code> <code>IOException { </code>
                        </div>
                        <div class="line number2 index1 alt1"><code>
                            &nbsp;&nbsp;&nbsp;&nbsp;</code><code>if</code><code>(Constants.WINDOWS) </code>
                        </div>
                        <div class="line number3 index2 alt2"><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>return</code>
                            <code>new</code> <code>SimpleFSDirectory(path, lockFactory); </code>
                        </div>
                        <div class="line number4 index3 alt1"><code>
                            &nbsp;&nbsp;&nbsp;&nbsp;</code><code>else</code></div>
                        <div class="line number5 index4 alt2"><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>return</code>
                            <code>new</code> <code>NIOFSDirectory(path, lockFactory); </code></div>
                        <div class="line number6 index5 alt1"><code>}</code></div>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</div>
                    