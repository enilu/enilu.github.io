---
layout: default 

---
 

<h4>最新文章</h4>


<ul class="posts">
{% for post in site.posts %}

 <hr>
   
  <h4 class="title">
      <a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a> 
      <span class="date">{{ post.date | date_to_string }}</span>
  </h4> 
      {{ post.content  | | split:'<!--break-->' | first }} 
   <br>
    <a href="{{ site.baseurl }}{{ post.url }}">查看文章...</a>
   
{% endfor %}

</ul>

  
