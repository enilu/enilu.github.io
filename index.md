---
layout: page
title: 你好世界
tagline: 贤惠妞，爱自己
---
{% include JB/setup %}
 
你好，世界！


<ul>

　　{% for post in site.posts %}

　　　　<li>{{ post.date | date_to_string }} <a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a></li>
            <p> {{ post.content  | | split:'<!--break-->' | first }}</p>

　　{% endfor %}

</ul>