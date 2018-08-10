---
author: raoenhui
layout: post
title: "自动生成不同大小形状的图片"
date: 2018-05-01 20:00
categories : NodeJS Koa
comments: true
tags:
- NodeJS
- koa
---

## 第一步 前言


实际前端工作中，当UED没有给到确定的图片时，前端需要自己模拟一个图片来实现页面占位。于是写了份自动生成不同大小形状图片的服务。
  
code地址为[https://github.com/raoenhui/create-img/tree/master/server](https://github.com/raoenhui/create-img/tree/master/server)。
 
demo访问地址[http://47.98.138.195/img](http://47.98.138.195/img)。


## 第二步 原理

主要用到的技术是koa、koa-router和canvas。

* 用koa启动一个webserver服务，用了logger中间键来方便查看记录。

```javascript

const logger = require('koa-logger');
const koaBody = require('koa-body');

const Koa = require('koa');
const app = module.exports = new Koa();

// middleware

app.use(logger());

app.use(koaBody());

// listen

if (!module.parent) app.listen(3000);

```

* 用koa-router获取用户访问的url，url中包含大小、形状和颜色信息，并调用canvas画图片。

```javascript

const router = require('koa-router')();
// route definitions

router.get('/:size/:shape/:bg', list)
  .get('/', list);

app.use(router.routes());

/**
 * Post listing.
 */

 function list(ctx) {
  var sizeAry=ctx.params.size?ctx.params.size.split('x'):[200,200];
  var shape=ctx.params.shape?ctx.params.shape:'rectangle'; //'rectangle||circle'
  var bgColor=ctx.params.bg?`#${ctx.params.bg}`:`#e83632`;

  var imgBuffer=getCanvas({width:Number(sizeAry[0]),height:Number(sizeAry[1]),shape,bgColor});
  ctx.type="image/jpg"
  ctx.status = 200;
  ctx.body = imgBuffer;
}

```

* 用canvas根据不同大小、形状和颜色信息画出图片。

```javascript

var Canvas=require('canvas');
module.exports = function (params) {
  let {shape,width,height,bgColor}=params;
    var canvas = new Canvas(width,width);
    var  ctx = canvas.getContext('2d');
  if(shape=='circle'){
    //圆形
    ctx.beginPath();
    ctx.fillStyle = bgColor;
    ctx.arc(width/2, width/2, width/2, 0, 2*Math.PI, true);
    ctx.fill();

    }else{
      //矩形
          ctx.fillStyle = bgColor;
         ctx.fillRect(0,0,width,height);
    }
  return canvas.toBuffer();
};

```

## 第三步 demo

如想获取宽高为200px，颜色为#e83632的圆形。
[http://47.98.138.195:3000/200x200/circle/e83632](http://47.98.138.195:3000/200x200/circle/e83632)

![website]({{ site.url }}/images/180501/demo.png)


Happy coding .. :)
