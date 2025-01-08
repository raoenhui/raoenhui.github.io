---
author: raoenhui
layout: post
title: "iPaaS京东零售之列表解决方案Drip Table"
date: 2021-12-14 14:30
categories : LowCode
comments: true
tags:
- LowCode
---

## 前言
根据全球领先的信息技术研究和顾问公司[Gartner](https://www.gartner.com/en)的最新预测，2021年全球`IT`支出将达到[4万亿美元](https://www.gartner.com/cn/newsroom/press-releases/gartner_2021_it_4)。那么中国作为亚太地区的经济大国与IT强国，中国的应用开发市场将会引来一个爆发期，未来几年内的增速都会超过全球平均水平。而研发资源有限，各公司都更着重考虑节省人力成本和提高人力效率，而大部分应用都离不开列表布局列表需求与日俱增，类型复杂多样，而研发资源有限，现有开发模式已难以满足日益增长的需求。因此京东零售`iPaaS`前端研发团队推出一种通过`LowCode`方式搭建`web`列表的技术方案`Drip-Table`，实现可视化搭建列表，节约开发人力。

随着近几月的不断优化迭代，框架已趋于稳定，目前已对外开源。
>* 源码地址：https://github.com/JDFED/drip-table
>* 官网地址：http://drip-table.jd.com

## 使用场景

> 1、无编程基础的用户想搭建自定义列表应用。

> 2、开发者高效创建列表，定制化需求可通过少量代码实现。

## 如何使用
先通过动态图片先给大家来露个脸～。
![driptable基础组件.gif](https://img10.360buyimg.com/imagetools/jfs/t1/209919/9/12490/4540144/61b71921Ee35a9a3c/e2f7167fef822f17.gif)

也可直接打开[Drip-Table](http://drip-table.jd.com/drip-table-generator/preview/)案例进行列表搭建。

## 架构方案介绍
列表整体流程如下：首先使用`Drip-Table-Generator`可视化搭建工具搭建列表，配置组件属性，如果不能满足业务场景，配置自定义组件，然后在线编写带嵌入模板数据的渲染逻辑，最后生成`JSON Schema`协议数据。通过`Drip-Table`渲染器动态渲染列表，最终实现业务方不经过开发，可直接完成列表相关业务需求。

![搭建流程.png](https://img11.360buyimg.com/imagetools/jfs/t1/160981/31/22710/82200/6178c695Eadf1aaaf/9cd53dcfb195054b.png)

## Drip-Table-Generator
`Drip-Table-Generator`是一种可视化搭建列表解决方案。
### Drip-Table-Generator的基础能力
那么一个好的可视化搭建列表方案需要具备哪些基础能力呢。主要包含以下`5`点：

![基础能力.png](https://img10.360buyimg.com/imagetools/jfs/t1/212489/19/2014/125804/6178c694E981b3fe8/d017318a4e58f800.png)

##### 1.HTML Tree 编辑 （样式编辑）
编辑页面可见元素, 能自由修改页面结构样式
##### 2.Component Tree 编辑 （组件编辑）
组件列表中选择组件, 通过拖拉的方式嵌入到页面中
##### 3.Custom Development （定制开发）
研发可介入开发自定义组件,满足定制化的场景
##### 4.Data 编辑 （数据编辑）
可视化的编辑页面的 数据部分, 如文本、URL
##### 5、Dynamic Logic 编辑 （逻辑编辑）
可自由添加业务判断逻辑的能力,如校验规则

### 列表组件以及配置

![组件以及配置.png](https://img11.360buyimg.com/imagetools/jfs/t1/155833/22/21930/102575/6178c694E017a293f/827a7b22ed901d38.png)

#### 基础组件
基础组件为列表常用通用组件，包含文本、图文、标签等组件。
#### 业务组件
业务组件通常只服务于特定业务，研发可以根据`Drip-table-generator`暴露的`API`方法，添加定制化业务组件。
#### 自定义组件
自定义组件解决了无法操作数据字段以及无法校验语法和逻辑的问题。搭建工具或者通过在线代码编辑器允许用户编写`LowCode`代码生成业务组件，然后进行语法检查，还能利用预览功能进行业务逻辑校验；另外，代码编辑器支持通过嵌套模板来进行数据操作。

![driptable自定义.gif](https://img10.360buyimg.com/imagetools/jfs/t1/215022/5/2056/338885/6178c695Ec997819b/757a254824b5403f.gif)

## Json Schema协议定义
采用国际规范(Understanding JSON Schema)，定义了全局以及列表项的`Json`数据格式。通过配置项，我们可以决定开启或关闭某些功能，或者设置表格样式等。

![image.png](https://img11.360buyimg.com/imagetools/jfs/t1/223161/13/197/275087/6178c694E9c51628c/2eaae6aa1519fd07.png)

	 
## Drip-Table
`Drip-Table`是一种基于`Json Schema`的渲染动态列表解决方案。
架构主要分为四块`JSON Schema`定义，分别为`Columns schema`、`Configs Schema`、`Refs`、`EventCallback`。还支持`Antd-design`和`Drip-design`主题包。
> * Columns schema定义列表组件的数据规范。
> * Configs Schema定义列表全局配置。
> * Refs暴露列表实例参数。
> * Event callback定义列表框架事件回调。

![image.png](https://img13.360buyimg.com/imagetools/jfs/t1/198311/33/14798/179638/6178c693E637d25d9/42a4c8f3820ef884.png)

## 成功案例
投放平台中低代码项目使用`Drip-Table`搭建素材列表，目前已搭建`72`种素材列表，高效支持双十一等集团大促需求，线上使用稳定，节约研发人力`75%`。
![image.png](https://img11.360buyimg.com/imagetools/jfs/t1/213162/13/2052/191507/6178c693Ef27fed0a/42a2f68780c7558e.png)

## 后续发展
`Drip-table`将专注于列表垂直领域，集成业界通用能力，赋能给各项业务，节约研发资源。
欢迎大家使用`Drip-table`和参与共建，也希望在[github](https://github.com/JDFED/drip-table)上点个[Star](https://github.com/JDFED/drip-table)支持我们一下～。

## 其他参考
> * Drip-Table源码地址:[https://github.com/JDFED/drip-table](https://github.com/JDFED/drip-table)
> * Drip-Table官网地址:[http://drip-table.jd.com](http://drip-table.jd.com)
> * Drip-Form源码链接:[https://github.com/JDFED/drip-form](https://github.com/JDFED/drip-form)
> * Leo源码链接:[https://github.com/JDFED/leo](https://github.com/JDFED/leo)
> * Micro-App源码链接:[https://github.com/micro-zoe/micro-app](https://github.com/micro-zoe/micro-app)
