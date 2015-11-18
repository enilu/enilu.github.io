var categoryArr = [['total', 3], ['java', 0], ['yunwei', 2],
    ['bigdata', 1], ['web', 0], ['mgr', 0]];
// 设置右侧文章类别数量
var setCategory = function () {
    $('.sidebar-categories').children().each(
        function (i, item) {
            $(item).children().first().children().first().html(
                '(' + categoryArr[i][1] + ')');
        });
}
setCategory();
//设置热门标签
var hotTags = [['大数据', '#'], ['hadoop', '#'], ['elasticsearch', '#'], ['性能优化', '#'], ['重构', '#'], ['redis', '#']]
var setHotTags = function () {
    for (var i = 0; i < hotTags.length; i++) {
        var hotTag = hotTags[i];
        $('.blog-tags > ul').append('<li><a href="' + hotTag[1] + '"><i class="fa fa-tags"></i>' + hotTag[0] + '</a></li>');
    }
}
setHotTags();
//设置首页文章
var homeNews = [{
    'title': 'Redis入门',
    'img': 'blog/2015/redis_1.png',
    'href': 'blog/2015/redis.html',
    'tag': 'redis,分布式缓存,大数据',
    'date': '4/07/2015',
    'descript': 'Redis是一个开源的使用ANSI C语言编写、支持网络、可基于内存亦可持久化的日志型、Key-Value数据库，并提供多种语言的API。 redis是一个key-value存储系统。和Memcached类似，它支持存储的value类型相对更多，包括string(字符串)、list(链表)、set(集合)、zset(sorted set --有序集合)和hash（哈希类型）。'
},
    {
        'title': ' MySQL主从配置',
        'img': 'blog/2015/mysql-master-slave.jpg',
        'href': 'blog/2015/mysql-master-slave.html',
        'tag': 'mysql, 性能优化',
        'date': '21/09/2015',
        'descript': 'mysql主从配置 版本：mysql5.6 os:centos6.5 主服务器：（192.168.1.1），从服务器：(192.168.1.2). 配置主服务器 修改/etc/my.cnf文件 在[mysqld]下面增加：'
    },
    {
        'title': 'CentOS配置bond ip冗余',
        'img': 'blog/2015/ipbond.png',
        'href': 'blog/2015/ipbond.html',
        'tag': 'centos, 运维',
        'date': '21/09/2015',
        'descript': 'Bonding的模式一共，有bonding模块的所有工作模式可以分为两类：多主型工作模式和主备型工作模式，balance-rr 和broadcast属于多主型工作模式而active-backup属于主备型工作模式。（balance-xor、自适应传输负载均衡模式（balance-tlb）和自适应负载均衡模式（balance-alb）也属于多主型工作模式，IEEE 802.3ad动态链路聚合模式（802.3ad）属于主备型工作模式。'
    }, {
        'title': 'linux mysql数据目录迁移',
        'img': 'assets/img/blog/mysql-data-transfer.png',
        'href': 'blog/2015/mysql-data-transfer.html',
        'tag': 'mysql, 运维,性能',
        'date': '14/06/2015',
        'descript': '版本：centos:6.5 64位 mysql:5.6,先说下mysql目录结构,centos6.5下安装mysql5.6后 mysql的默认结构为：配置文件：/etc/my.cnf,然后my.cnf中会列出几个默认的目录：数据目录 ： datadir=/var/lib/mysql,日志文件：log-error=/var/log/mysqld.log,进程id文件：pid-file=/var/run/mysqld/mysqld.pi'
    }
]
var setHomeNews = function () {
    $('.blog-posts > div').each(function (i, item) {
        if (i < homeNews.length) {
            $(item).show();
            $(item).find('.img-responsive').attr('src', homeNews[i].img);
            $(item).find('a').attr('href', homeNews[i].href);
            $(item).find('a[tag="title"]').html(homeNews[i].title);
            $(item).find('.fa-calendar').parent().append(homeNews[i].date);
            $(item).find('.fa-tags').parent().append(homeNews[i].tag);
            $(item).find('p').html(homeNews[i].descript);
        }

    });
    for (var i = 0; i < homeNews.length; i++) {
        var homeNew = homeNews[i];
        console.log(homeNew.title);
    }
}
setHomeNews();

var yearCateories = [{'title': '2015', 'count': 10, 'href': '#'}, {'title': '2009', 'count': 6, 'href': '#'}]
var setYearCateories = function () {
    for (var i = 0; i < yearCateories.length; i++) {
        $('.sidebar-categories').append('<li><a href="' + yearCateories[i].href + '">' + yearCateories[i].title + ' (' + yearCateories[i].count + ')</a></li>')
    }
}
setYearCateories();
var hotArts = [
    {
        'title': '精选转载', 'desc': '精选文章转载',
        'href': 'http://enilu.github.io/blog/blog/2015/hot_article.html'
    },
    {
        'title': 'Redis入门',
        'desc': 'Redis是一个开源的使用ANSI C语言编写、支持网络、可基于内存亦可持久化的日志型、Key-Value数据库，并提供多种语言的API',
        'href': 'http://enilu.github.io/blog/blog/2015/redis.html'
    },
    {
        'title': 'mysql主从配置',
        'desc': ' mysql主从配置 版本：mysql5.6 os:centos6.5 主服务器：（192.168.1.1），从服务器：(192.168.1.2)',
        'href': 'http://enilu.github.io/blog/blog/2015/mysql-master-slave.html'
    },
    {
        'title': 'CentOS配置bond ip冗余',
        'desc': 'Bonding的模式一共，有bonding模块的所有工作模式可以分为两类：多主型工作模式和主备型工作模式',
        'href': 'http://enilu.github.io/blog/blog/2015/ipbond.html'
    }];


// 设置热门文章
var setHotart = function () {
    $('.recent-news').children().each(function (i, item) {
        var tmp = $(item).find('.recent-news-inner');
        tmp.find('a').html(hotArts[i].title).attr('href', hotArts[i].href);
        tmp.find('p').html(hotArts[i].desc);
    });
}

setHotart();