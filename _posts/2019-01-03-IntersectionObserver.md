---
author: raoenhui
layout: post
title: "Intersection observer检测元素是否在视窗内"
date: 2019-01-03 23:00
categories : Js
comments: true
tags:
- Js
---

## 前言

一直以来，检测元素在浏览器视窗口内不是件容易的事，很多解决方案都不能很准确的判断，计算量也有可能拖慢网站性能。
但是很多场景都需要用到：
> * 当页面滚动时，懒加载图片或其他内容。
> * 实现“可无限滚动”网站，也就是当用户滚动网页时直接加载更多内容，无需翻页。
> * 为计算广告收益，检测其广告元素的曝光情况。
> * 根据用户是否已滚动到相应区域来灵活开始执行任务或动画。

## 通常检测是否在视窗内原理

监听浏览器滚动事件`scroll`，对每个目标元素执行[Element.getBoundingClientRect()](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect),`getBoundingClientRect`方法返回元素的大小及其相对于视口的位置。 此方法可获取整个网页左上角定位 ，及距浏览器顶部的或左侧的距离，然后用`innerHeight `、`innerwidth `等得到视窗大小，以此相减来判断是否在视窗范围内。

具体代码如下：[https://codepen.io/raoenhui/pen/BGBYpX](https://codepen.io/raoenhui/pen/BGBYpX)

还有其他检测原理大多都是通过计算得到，但是下面我将要介绍由浏览器自带方法检测元素是否在视窗内。

## 新检测原理Intersection observer 

Intersection observer 允许你配置一个回调函数，每当`target`进入浏览器视窗时，触发回调函数。
![example1.gif](https://raoenhui.github.io/images/190103/1.gif)

源码地址：[https://codepen.io/raoenhui/pen/XoVEjK](https://codepen.io/raoenhui/pen/XoVEjK)

### 用法

```javascript
var options = {
    root: document.querySelector('#scrollArea'), 
    rootMargin: '0px', 
    threshold: 1.0
}
var callback = function(entries, observer) { 
    /* Content excerpted, show below */ 
};
var observer = new IntersectionObserver(callback, options);
```
### 参数
options 配置项
> * root 目标元素。默认使用浏览器视口做为root
> * rootMargin root元素的外边距。
> * threshold 阈值。可以是单一的number也可以是number数组，一般取1。

callback 回调函数

### 案例
![example.gif](https://raoenhui.github.io/images/190103/2.gif)

源码地址：[https://codepen.io/raoenhui/pen/xQKPaK](https://codepen.io/raoenhui/pen/xQKPaK)

target元素和root元素相交程度达到该值的时候IntersectionObserver注册的回调函数将会被执行。
如果你只是想要探测当target元素的在root元素中的可见性超过50%的时候，你可以指定该属性值为0.5。如果你想要target元素在root元素的可见程度每多25%就执行一次回调，那么你可以指定一个数组[0, 0.25, 0.5, 0.75, 1]。默认值是0(意味着只要有一个target像素出现在root元素中，回调函数将会被执行)。该值为1.0含义是当target完全出现在root元素中时候 回调才会被执行。

插件`jquery_lazyload`懒加载就是用到了此方法，

源码地址：[https://github.com/tuupola/jquery_lazyload](https://github.com/tuupola/jquery_lazyload/blob/2.x/lazyload.js)
```javascript
 this.observer = new IntersectionObserver(function(entries) {
                entries.forEach(function (entry) {
                    if (entry.intersectionRatio > 0) {
                        self.observer.unobserve(entry.target);
                        let src = entry.target.getAttribute(self.settings.src);
                        let srcset = entry.target.getAttribute(self.settings.srcset);
                        if ("img" === entry.target.tagName.toLowerCase()) {
                            if (src) {
                                entry.target.src = src;
                            }
                            if (srcset) {
                                entry.target.srcset = srcset;
                            }
                        } else {
                            entry.target.style.backgroundImage = "url(" + src + ")";
                        }
                    }
                });
            }, observerConfig);
```
### 兼容性
兼容性`chrome`基本支持，但是意外的是`safari`支持性不好，用到的小伙伴们要注意这点了，兼容性具体看下图：
![image.png](https://raoenhui.github.io/images/190103/1.jpg)

## 其他链接
> * 官方链接[Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
> * [https://codepen.io/raoenhui/pen/BGBYpX](https://codepen.io/raoenhui/pen/BGBYpX)
> * [https://codepen.io/raoenhui/pen/XoVEjK](https://codepen.io/raoenhui/pen/XoVEjK)
> * [https://codepen.io/raoenhui/pen/xQKPaK](https://codepen.io/raoenhui/pen/xQKPaK)

Happy coding .. :)