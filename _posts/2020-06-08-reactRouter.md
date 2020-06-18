---
author: raoenhui
layout: post
title: "React Router源码分析"
date: 2020-06-08 22:07
categories : React
comments: true
tags:
- React
---

### 前言

发现`react-route`用`Link`或`Push`跳转时,没有刷新页面,但是`Url`变了，而且点击浏览器自动的返回按钮，`Url`变了但是页面不刷新，怎么做到的呢？于是本妹子就从这个方向研究了下`react-route`的源码，给小伙伴们分享下。

### 解密-点击返回按钮但页面不刷新

#### 一、HashRouter 分析
通过`location.hash`来达到`url`变但页面不刷新
```js
location.hash=hash
```
然后在通过`onhashchange`监听浏览器的返回事件
```js
window.addEventListener('onhashchange', (event) => {
    changeDisplayName();//替换显示的内容
});
```
#### 二、 BrowserRouter 分析

通过pushState来达到url变但页面不刷新，`history.push`实际是用原生`history.pushState`来实现的，`history.replace`实际是用原生`history.replaceState`来实现的。
```js
changeDisplayName();//替换显示的内容
window.history.pushState(null, null, newUrl);
```
然后在通过`popstate`监听浏览器的返回事件
```js
window.addEventListener('popstate', (event) => {
    changeDisplayName();//替换显示的内容
});
```
##### 案例
具体代码为`codepen`上的[change page with history package](https://codepen.io/huihui/pen/qBbOajM)
```js
import React, { useEffect, useState, useRef, Component } from 'react';
const MapPage=()=>{
  return <div>MapPage</div>
}
const RankPage=()=>{
  return <div>RankPage</div>
}

function ConPage() {
  const[Page, setPage] = useState('rank');

  useEffect(()=>{
  
    window.addEventListener('popstate', (event) => {
      console.log("location: " + document.location + ", state: " + JSON.stringify(event.page));
      let val;
      if(event.page=='rank') {
        val='rank'
      }else{
        val='map'
      }
      console.log('useEffect',val) 
      setPage(val)
    });
  },[])


  const _changePage = () => {
    if(Page=='rank') {
      setPage('map')
      window.history.pushState({page:'map'}, null, 'http://dev.jd.com:10086/con?pId=map');
     }else{
      setPage('rank')
      window.history.pushState({page:'rank'}, null, 'http://dev.jd.com:10086/con?pId=rank');
     }
  }

  return (
    <div>
      <div onClick={_changePage} className='btnTest'> 切换路由</div>

      {Page=='rank' &&
        <RankPage />
      }
      {Page=='map' &&
      <MapPage />
    }
    </div>
  )
}
export default ConPage
```

#### 三、与 history 结合

`popstate`和`onhashchange`方法对`android4.4.4`不兼容，需要引入[history](https://www.npmjs.com/package/history)这个`npm`包，里面有兼容性代码，如果判断不兼容，就直接按照`window.location.href`跳转。

具体代码为`codepen`上的[change URL with history package](https://codepen.io/huihui/pen/gOPaMNE)
```js
const history = History.createBrowserHistory();
const Location = history.location;

const MapPage=()=>{
  return <div>MapPage</div>
}
const RankPage=()=>{
  return <div>RankPage</div>
} 

function ConPage() {
  const[Page, setPage] = React.useState('rank');

  React.useEffect(()=>{
   history.listen((Location, action) => {
      console.log(action, Location.state);
      if(Location.state.page && Location.state.page=='map'){
        setPage('map')
      }else{
        setPage('rank')
      }
    });
  },[])


  const _changePage = () => {
    if(Page=='rank') {
      history.push('/con?pId=map',{  page: 'map' });
     }else{
      history.push('/con?pId=rank',{  page: 'rank' });
     }
  }

  return (
    <div>
      <button onClick={_changePage} className='btnTest'> 切换路由</button>
      {Page=='rank' &&<RankPage />}
      {Page=='map' &&<MapPage />}
    </div>
  )
}

ReactDOM.render(
<ConPage />,
    document.getElementById('root'),
  )
```

#### 四、查看显示页面

##### 源码
[react-router](https://github.com/ReactTraining/react-router)里的RouterContext.js

```js
//TODO:直接用React.createContext也可以
import createContext from "mini-create-react-context";

const createNamedContext = name => {
  const context = createContext();
  context.displayName = name;

  return context;
};

const context = /*#__PURE__*/ createNamedContext("Router");
export default context;

```
##### 分析

[Context.displayName](https://reactjs.org/docs/context.html#contextdisplayname)解释：
`context `对象接受一个名为 `displayName` 的` property`，类型为字符串。`React DevTools `使用该字符串来标示`context` 要显示的内容。

示例，下述组件在 `DevTools` 中将显示为 [MyDisplayName](https://zh-hans.reactjs.org/docs/context.html#classcontexttype)：



```js
const MyContext = React.createContext(/* some value */);
MyContext.displayName = 'MyDisplayName';

<MyContext.Provider> // "MyDisplayName.Provider" 在 DevTools 中
<MyContext.Consumer> // "MyDisplayName.Consumer" 在 DevTools 中
```

Happy coding .. :)

### 相关链接
[react-router github](https://github.com/ReactTraining/react-router)

[history github](https://github.com/ReactTraining/history)

[popstate接口API](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/popstate_event)

[onHashchange兼容性](https://caniuse.com/#search=onHashchange)

[change URL with history package](https://codepen.io/huihui/pen/gOPaMNE)

[Change URL without refreshing page](https://codepen.io/huihui/pen/qBbOajM)