---
author: raoenhui
layout: post
title: "react-router中的exact和strict"
date: 2019-05-04 22:07
categories : React
comments: true
tags:
- React
---

### 前言
每次用配置`react`路由都会考虑是否应该给给`<Route>`组件加上`exact`或`strict`。下面妹子将于自认为比较清晰的方式列举出来什么场景需要加和不加。
> 本文案例主要以react-router v4+为主，v5版本是因为发布时版本依赖有问题而直接跳成这个大版本的,用法和4完全相同，就是这么任性 > < ，升级详情可看本文最后链接

### exact
`exact`默认为false，如果为true时，需要和路由相同时才能匹配，但是如果有斜杠也是可以匹配上的。
如果在父路由中加了`exact`，是不能匹配子路由的,建议在子路由中加`exact`，如下所示
```javascript
//父路由
<Switch>
    <Route path="/a" component={ComponentA} />
</Switch>
```
```javascript
//子路由，tuanDetail组件里
<Switch>
        <Route path="/a/b" exact component={ComponentB}/>
</Switch>
```

### strict

<Route strict path="/one" component={About} />

`strict`默认为false，如果为true时，路由后面有斜杠而url中没有斜杠，是不匹配的

### 案例
![image.png](https://raoenhui.github.io/images/190504/1.jpg)

### 总结
如果没有子路由的情况，建议大家配都加一个`exact`；如果有子路由，建议在子路由中加`exact`，父路由不加；

而`strict`是针对是否有斜杠的，一般可以忽略不配置。

## 其他链接
> https://reacttraining.com/react-router/web/api/Route/exact-bool
> https://reacttraining.com/blog/react-router-v5/

Happy coding .. :)






