---
layout: page
title: enilu的网络日志
---

 


<!-- 遍历分页后的文章 -->
{% for post in site.posts %}
<h1><a href="{{ post.url }}">{{ post.title }}</a></h1>
<p class="author">
    <span class="date">{{ post.date | date_to_string }}</span>
</p>
<div class="content">
    {{ post.content  | | split:'<!--break-->' | first }}
    <br>
    <a href="{{ site.baseurl }}{{ post.url }}">查看全部..</a>
</div>
{% endfor %}
