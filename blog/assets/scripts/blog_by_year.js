var year2009 = [{
    'title': '用amchart的时候遇到一个难题',
    'href': 'blog/2009/amchart.html',
    'descript': '用amchart的时候遇到一个难题：将数据库里的数据生成xml.'
}, {
    'title': 'java生成xml数据的一点困惑',
    'href': 'blog/2009/createxml.html',
    'descript': '由于之前页面用的是ajax请求数据，后来想在页面再添加一个表格数据的时候也打算继续用这种方式：ajax提交后台组长xml数据返回，回调函数中用js解析xml生成表格。困惑来了，组装xml的时候本来我是这么做的：用一个StringBuilder然后一个一个节点在后面追加。最后用PrinterWriter将这个StringBuilder对象输出。写完之后觉得页面比较乱，如下，代码具体内容大伙不必关注，只看下大致情形即可'
}, {
    'title': 'c#连接mysql',
    'href': 'blog/2009/csharpconnectmysql.html',
    'descript': '想用c#做点桌面应用，可是又不想用sqlserver，准备用mysql，找了些资料，先来个简单的连接例子：首先要下载mysql的的.net驱动，我下的是：mysql-connector-net-5.0.3，下载地址：ftp://gd.tuwien.ac.at/db/mysql/Downloads/Connector-Net/   这里也可以：http://library.pantek.com/Applications/MySQL/Downloads/Connector-Net/'
}, {
    'title': 'itext 生成图文混排的pdf文件',
    'href': 'blog/2009/itext.html',
    'descript': 'itext 生成图文混排的pdf文件'
}, {
    'title': 'linux开启telnet',
    'href': 'blog/2009/starttelnet.html',
    'descript': 'Linux默认没有开启telnet，首先更改/etc/xinetd.d/telnet文件，有的可能没有该文件，有比如krb5-telnet之类的，那就更改这个文件，如果实在一个跟telnet沾边的文件都没有；可能是没有安装telent服务，就需要拿盘再安装了，或者安装后还没有，就新建一个该文件，文件内容为：'
}];
var year2014 = [{
    'title': '通过统计nginx访问日志禁止恶意抓取数据的实现 ',
    'href': 'blog/2014/nginx_log.html',
    'descript': '业务需求：每小时读取access.log内容，统计每个ipd访问系统次数，如果超过指定次数，则将该ip加入到防火墙中，以便禁止其继续访问（后续可以考虑不是禁止其访问服务，而是重定向到指定的页面）。这样避免别人恶意从自己网站上抓取数据 '
}, {
    'title': '使用Jsoup解析HTML文档',
    'href': 'blog/2014/jsoup.html',
    'descript': 'Jsoup是一款开源的抓取和解析网页的java组件，它可以很方便的对静态html进行解析，也可以方便的根据URL获取动态的页面内容，支持POST和get方式请求，而且支持参数的传递。其设计非常简单易用，毫无学习压力。 '
}, {
    'title': 'apache shiro踢出用户和获取所有在线用户',
    'href': 'blog/2014/apache_shiro.html',
    'descript': '产品要求用户只能在同一个地方登录，如果之前在其他机器或者浏览器上登录，讲之前登录帐号踢出。applicationContext-shiro.xml配置：    在默认的shiro配置上增加如下配置(本文假设你已经使用过apache shiro，并且已经使用shiro成功实现登录功能）：'
}, {
    'title': 'lucene in action 读书笔记-实践1简单的桌面搜索器',
    'href': 'blog/2014/lucene_desktop.html',
    'descript': '需求，做一个桌面搜索小工具，将制定的目录下的文件，生成索引，提供一个搜索界面，输入关键字，在内容里搜索匹配的文件，列出文件信息：'
}
    , {
        'title': 'nginx和tomcat负载均衡',
        'href': 'blog/2014/nginx_tomcat.html',
        'descript': '前段时间领导总是要看系统，但是系统总是频繁更新，为了避免更新系统的时候领导看不到东西，打算用ngix做代理，后台部署两个tomcat做负载均衡，避免更新一台就无法使用系统的问题，这两天看了写资料，把几个关键点记录在这里以便备忘。'
    }
    , {
        'title': 'lucene in action 读书笔记',
        'href': 'blog/2014/lucene_in_action.html',
        'descript': '09年的时候就接触了lucene，可惜一直没有机会在项目中实战，去年终于有机会在项目离使用，可惜由于当时时间紧张，没有好好深入，只是用到什么看什么。最近重新看了下《Lucene In Action》，算是系统的对lucene有个了解，该笔记记录了该书中第一章，主要针对Lucene的级别概念和用法做了描述。'
    }
    , {
        'title': '5分钟看懂BSON协议',
        'href': 'blog/2014/bson.html',
        'descript': 'NOSQL从10年开始已经发展了4年了。其中最火的Mongodb也被人熟知，不过自己一直没有机会了解下这方面东东，最近有时间稍微看了下Mongodb的bson协议，在同事的指导下，整理出来分享给大家。至于BSON的概念我就不赘述了，自己找度娘。'
    }
    , {'title': '', 'href': '', 'descript': ''}
    , {'title': '', 'href': '', 'descript': ''}
    , {'title': '', 'href': '', 'descript': ''}
    , {'title': '', 'href': '', 'descript': ''}];
var year2015 = [{
    'title': 'CentOS配置ip冗余配置',
    'href': 'blog/2015/ipbond.html',
    'descript': 'Bonding的模式一共，有bonding模块的所有工作模式可以分为两类：多主型工作模式和主备型工作模式，balance-rr 和broadcast属于多主型工作模式而active-backup属于主备型工作模式。（balance-xor、自适应传输负载均衡模式（balance-tlb）和自适应负载均衡模式（balance-alb）也属于多主型工作模式，IEEE 802.3ad动态链路聚合模式（802.3ad）属于主备型工作模式。'
}, {
    'title': 'Apache James快速部署',
    'href': 'blog/2015/james.html',
    'descript': 'Apache James是Aapache组织出品的开源邮件系统。下载直接去起官方网站下载即可，安装也是个解压过程。'
}, {
    'title': 'linux mysql数据目录迁移',
    'href': 'blog/2015/mysql-data-transfer.html',
    'descript': '版本：centos:6.5 64位 mysql:5.6,先说下mysql目录结构,centos6.5下安装mysql5.6后 mysql的默认结构为：配置文件：/etc/my.cnf,然后my.cnf中会列出几个默认的目录：数据目录 ： datadir=/var/lib/mysql,日志文件：log-error=/var/log/mysqld.log,进程id文件：pid-file=/var/run/mysqld/mysqld.pi'
}, {
    'title': 'mysql主从配置',
    'href': 'blog/2015/mysql-master-slave.html',
    'descript': 'mysql主从配置 版本：mysql5.6 os:centos6.5 主服务器：（192.168.1.1），从服务器：(192.168.1.2). 配置主服务器 修改/etc/my.cnf文件 在[mysqld]下面增加：'
}, {
    'title': 'Redis入门',
    'href': 'blog/2015/redis.html',
    'descript': 'Redis是一个开源的使用ANSI C语言编写、支持网络、可基于内存亦可持久化的日志型、Key-Value数据库，并提供多种语言的API。 redis是一个key-value存储系统。和Memcached类似，它支持存储的value类型相对更多，包括string(字符串)、list(链表)、set(集合)、zset(sorted set --有序集合)和hash（哈希类型）。'
}, {
    'title': 'ElasticSearch 简单入门 ',
    'href': 'blog/2015/es_start.html',
    'descript': 'ElasticSearch是一个开源的分布式搜索引擎，具备高可靠性，支持非常多的企业级搜索用例。像Solr4一样，是基于Lucene构建的。支持时间时间索引和全文检索。官网：http://www.elasticsearch.org.  它对外提供一系列基于java和http的api，用于索引、检索、修改大多数配置。'
}]

var loadByYear = function (datalist) {
    for (var i = 0; i < datalist.length; i++) {
        var article = datalist[i];
        if (article.title == '') {
            continue;
        }
        var item = '<div class="search-result-item">';
        item += '<h4><a href="' + article.href + '">' + article.title + '</a></h4>';
        item += '<p>' + article.descript + '</p>';
        item += '<a href="' + article.href + '" class="search-link">' + rootPath + article.href + '</a>';
        item + '</div>';
        $('#articleList').append(item);
    }
}