var rootPath='http://enilu.github.io/blog/';
//var categoryArr = [['total', 3], ['java', 0], ['yunwei', 2],
//    ['bigdata', 1], ['web', 0], ['mgr', 0]];
//// 设置右侧文章类别数量
//var setCategory = function () {
//    $('.sidebar-categories').children().each(
//        function (i, item) {
//            $(item).children().first().children().first().html(
//                '(' + categoryArr[i][1] + ')');
//        });
//}
//setCategory();
//设置热门标签
var hotTags = [['大数据', '#'], ['hadoop', '#'], ['elasticsearch', '#'], ['性能优化', '#'], ['重构', '#'], ['redis', '#']]
var setHotTags = function () {
    for (var i = 0; i < hotTags.length; i++) {
        var hotTag = hotTags[i];
        $('.blog-tags > ul').append('<li><a href="' + hotTag[1] + '"><i class="fa fa-tags"></i>' + hotTag[0] + '</a></li>');
    }
}
setHotTags();

var yearCateories = [{'title': '2015', 'count': 5, 'href': '2015.html'},{'title': '2014', 'count': 1, 'href': '2014.html'}, {'title': '2009', 'count': 5, 'href': '2009.html'}]
var setYearCateories = function () {
    for (var i = 0; i < yearCateories.length; i++) {
        $('.sidebar-categories').append('<li><a href="' + rootPath+yearCateories[i].href + '">' + yearCateories[i].title + ' (' + yearCateories[i].count + ')</a></li>')
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