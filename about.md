---
layout: page
permalink: /about/index.html
title: Ice Rao
tags: [Ice, Rao, Enhui]
chart: true
---

{% assign total_words = 0 %}
{% assign total_readtime = 0 %}
{% assign featuredcount = 0 %}
{% assign statuscount = 0 %}

{% for post in site.posts %}
    {% assign post_words = post.content | strip_html | number_of_words %}
    {% assign readtime = post_words | append: '.0' | divided_by:200 %}
    {% assign total_words = total_words | plus: post_words %}
    {% assign total_readtime = total_readtime | plus: readtime %}
    {% if post.featured %}
    {% assign featuredcount = featuredcount | plus: 1 %}
    {% endif %}
{% endfor %}

Thanks For showing interest to check about me, i'm **Ice Rao**. I cook delicious code library for fun. I’m a Born programmer, computer lover, romantic novel reader, like to play dance machine! curious towards css3,html5,nodejs,ES6,sql,and so on.This is my personal blog. It currently has {{ site.posts | size }} posts in {{ site.categories | size }} categories which combinedly have {{ total_words }} words, which will take an average reader ({{ site.wpm }} WPM) approximately <span class="time">{{ total_readtime }}</span> minutes to read. {% if featuredcount != 0 %}There are <a href="{{ site.url }}/featured">{{ featuredcount }} featured posts</a>, you should definitely check those out.{% endif %} The most recent post is {% for post in site.posts limit:1 %}{% if post.description %}<a href="{{ site.url }}{{ post.url }}index.html" title="{{ post.description }}">"{{ post.title }}"</a>{% else %}<a href="{{ site.url }}{{ post.url }}index.html" title="{{ post.description }}" title="Read more about {{ post.title }}">"{{ post.title }}"</a>{% endif %}{% endfor %} which was published on {% for post in site.posts limit:1 %}{% assign modifiedtime = post.modified | date: "%Y%m%d" %}{% assign posttime = post.date | date: "%Y%m%d" %}<time datetime="{{ post.date | date_to_xmlschema }}" class="post-time">{{ post.date | date: "%d %b %Y" }}</time>{% if post.modified %}{% if modifiedtime != posttime %} and last modified on <time datetime="{{ post.modified | date: "%Y-%m-%d" }}" itemprop="dateModified">{{ post.modified | date: "%d %b %Y" }}</time>{% endif %}{% endif %}{% endfor %}. The last commit was on {{ site.time | date: "%A, %d %b %Y" }} at {{ site.time | date: "%I:%M %p" }} [UTC](http://en.wikipedia.org/wiki/Coordinated_Universal_Time "Temps Universel Coordonné").

**前端妹子一枚，我平时比较繁忙（正业：打杂、犯花痴、偷窥帅锅，副业：码农、前端）,所以知识点有些可能会有问题，看不过眼（强迫症的请重视我的后面一句），欢迎小伙伴们帮忙评论修改。**

**非常欢迎各位研发大佬们加入上海京东团队，有意向可以投简历到邮箱<a href="mailto:raoenhui@jd.com">raoenhui@jd.com</a>中，TKS。**

