//设置首页文章
var homeNews = [{
    'title': '数据抓取之数据抓取流程', 'img': 'blog/2015/images/crawler_process/crawler1.png',
    'href': 'blog/2015/crawler_process.html', 'tag': '数据抓取', 'date': '23/11/2015',
    'descript': '公司的数据抓取系统也写了一阵子了，是时候总结下了，不然凭我的记性，过一段时间就忘的差不多了。打算写一个系列将其中踩过的坑都记录下来。暂时定一个目录，按照这个系列来写'
}, {
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
//setHomeNews();