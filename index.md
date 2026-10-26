---
layout: default
translation_key: home
seo_title: "enilu 的技术博客｜Java、数据库与 AI 开发实践"
description: "enilu 的个人技术博客，分享 Java 与 Spring 开发、数据库运维、搜索与数据采集，以及 AI 辅助多项目开发的实践。通过问题排查、代码示例和工具使用经验，记录具体做法与适用边界。"

---


<ul class="posts">
{% for post in site.posts %}

 <hr>

  <h4 class="title">
      <a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a>
      <span class="date">{{ post.date | date_to_string }}</span>
  </h4>
      {{ post.content | split:'<!--break-->' | first }}
   <br>
    <a href="{{ site.baseurl }}{{ post.url }}">查看文章...</a>

{% endfor %}

</ul>
