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


var loadByYear = function (datalist) {
    for (var i = 0; i < datalist.length; i++) {
        var article = datalist[i];
        var item = '<div class="search-result-item">';
        item += '<h4><a href="' + article.href + '">' + article.title + '</a></h4>';
        item += '<p>' + article.descript + '</p>';
        item += '<a href="' + article.href + '" class="search-link">' + rootPath + article.href + '</a>';
        item + '</div>';
        $('#articleList').append(item);
    }
}