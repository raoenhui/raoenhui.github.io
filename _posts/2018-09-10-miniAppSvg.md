---
author: raoenhui
layout: post
title: "小程序加载svg图片"
date: 2018-09-10 12:00
categories : wechat
comments: true
tags:
- Wechat
- Es6
---

##  前言

小程序的[组件](https://developers.weixin.qq.com/miniprogram/dev/component/)中是没有支持`SVG`标签的。
但是在前端小伙伴的实际开发中，UED经常提供SVG图片过来，如果不想用引入`iconfont`的话，那么妹子我将介绍个很好用的方法。

### SVG 简介

- SVG 指可伸缩矢量图形 (Scalable Vector Graphics)
- SVG 使用 XML 格式定义图形
- SVG 图像在放大或改变尺寸的情况下其图形质量不会有所损失
- SVG 与JPEG和GIF图像比起来，尺寸更小，且可压缩性更强。
- 适合各种icon和图标

### 去除 SVG 中不需要的代码

我们知道 `SVG` 实际是由代码组成，可以将 `SVG` 图片直接用IDE打开(如sublime),可以查看并修改其颜色形状大小。
![sublime](https://upload-images.jianshu.io/upload_images/9902136-83b36f53e4d21616.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

其中有很多 `SVG` 代码我们可以去除，如注释、多余空格等等，可以用网站 [https://jakearchibald.github.io/svgomg](https://jakearchibald.github.io/svgomg)，来精简SVG：
![image.png](https://upload-images.jianshu.io/upload_images/9902136-cc196a2d1e0dd193.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 将 SVG 转化成Base64

打开网站[https://www.sojson.com/image2base64.html](https://www.sojson.com/image2base64.html)来转Base64
![image.png](https://upload-images.jianshu.io/upload_images/9902136-4bb377140d6ea9ee.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

接着在WXSS和WXML中使用
```css
// Base64 在CSS中的使用
.box{
  background-image: url("刚刚转的Base64");
}
```
```html
// Base64 在HTML中的使用
<img src="data:image/jpg;base64,/9j/4QMZR..." />
```
小程序中引用完成

![image.png](https://upload-images.jianshu.io/upload_images/9902136-43512b3b11b7c91b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


Happy coding .. :)
