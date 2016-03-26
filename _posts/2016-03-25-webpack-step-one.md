---
author: raoenhui
layout: post
title: "webpack入门教程"
date: 2016-06-25 23:51
comments: true
category : webpack
tags:
- webpack
---
webpack入门教程


## 介绍

这是一个webpack的最简单教程
你将会学到:

- 如何安装webpack
- 如何使用webpack

##安装

首先你要安装nodejs和npm

``` 
 sudo npm install webpack -g
```

![webpack]({{ site.url }}/images/blog/webpackStepOne-1.png)

##开始编辑

> 新建文件 entry.js

{% highlight js %}
document.write(require("./content.js"));
{% endhighlight %}

> 新建文件 index.html

{% highlight html %}
<html>
    <head>
        <meta charset="utf-8">
    </head>
    <body>
        <script type="text/javascript" src="bundle.js" charset="utf-8"></script>
    </body>
</html>
{% endhighlight %}

> 新建文件 content.js

{% highlight js %}
module.exports = "It works from content.js.";
{% endhighlight %}


运行

``` 
 webpack ./entry.js bundle.js
```

编译结果为：

{% highlight bash %}
Hash: a5409e97d9575465c66c  
Version: webpack 1.12.14  
Time: 52ms  
    Asset     Size  Chunks             Chunk Names  
bundle.js  1.55 kB       0  [emitted]  main  
   [0] ./entry.js 41 bytes {0} [built]  
   [1] ./content.js 42 bytes {0} [built]
{% endhighlight %}

![webpack]({{ site.url }}/images/blog/webpackStepOne-2.png)

有兴趣的小伙伴们还可以看下下面文档:

+ [webpack官网](http://webpack.github.io/)
+ [webpack入门例子](https://github.com/raoenhui/webpack)


Happy Codeing .... :)
