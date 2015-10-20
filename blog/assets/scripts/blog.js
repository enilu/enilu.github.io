var categoryArr = [ [ 'total', 3 ], [ 'java', 0 ], [ 'yunwei', 2 ],
		[ 'bigdata', 1 ], [ 'web', 0 ], [ 'mgr', 0 ] ];

var hotArts = [
		[ '精选转载', '网上精选文章转载',
				'http://enilu.github.io/blog/blog/2015/hot_article.html' ],
		[
				'Redis入门',
				'Redis是一个开源的使用ANSI C语言编写、支持网络、可基于内存亦可持久化的日志型、Key-Value数据库，并提供多种语言的API',
				'http://enilu.github.io/blog/blog/2015/redis.html' ],
		[
				'mysql主从配置',
				' mysql主从配置 版本：mysql5.6 os:centos6.5 主服务器：（192.168.1.1），从服务器：(192.168.1.2)',
				'http://enilu.github.io/blog/blog/2015/mysql-master-slave.html' ],
		[ 'CentOS配置bond ip冗余',
				'Bonding的模式一共，有bonding模块的所有工作模式可以分为两类：多主型工作模式和主备型工作模式',
				'http://enilu.github.io/blog/blog/2015/ipbond.html' ] ];

// 设置右侧文章类别数量
var setCategory = function() {
	$('.sidebar-categories').children().each(
			function(i, item) {
				$(item).children().first().children().first().html(
						'(' + categoryArr[i][1] + ')');
			});
}
setCategory();

// 设置热门文章
var setHotart = function() {
	$('.recent-news').children().each(function(i, item) {
		var tmp = $(item).find('.recent-news-inner');
		tmp.find('a').html(hotArts[i][0]).attr('href', hotArts[i][2]);
		tmp.find('p').html(hotArts[i][1]);
	});
}

setHotart();
// 设置最近关注
var setBlogtask = function() {

}