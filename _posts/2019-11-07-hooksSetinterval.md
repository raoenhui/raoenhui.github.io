---
author: raoenhui
layout: post
title: "React Hooks与setInterval"
date: 2019-11-07 16:07
categories : React
comments: true
tags:
- Js
- React
---

### 前言

Hooks出来已经有段时间了，相信大家都用过段时间了，有没有小伙伴们遇到坑呢，我这边就有个`setInterval`的坑，和小伙伴们分享下解决方案。

### 问题
写个`count`每秒自增的定时器，如下写法结果，界面上`count`为`1`？
```javascript
function Counter() {
  let [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <h1>{count}</h1>;
}
```
[https://codesandbox.io/embed/hooks-setinterval-error-w4qu6](https://codesandbox.io/embed/hooks-setinterval-error-w4qu6)

> 如果某些特定值在两次重渲染之间没有发生变化，你可以通知` React` 跳过对 `effect` 的调用。就是将第二个参数改成`[]`,类似于更接近类组件的` componentDidMount` 和` componentWillUnmount `生命周期，只执行一次。 `effect`的第二个参数中传入的值就是 它更改的话， `effect`也会重新执行一遍的值。

因为`Effect`的第二个参数为`[]`，没有依赖,`Effect`只会执行一次。`setInterval`中拿到的是第一次渲染时的闭包`count`，所以`count`永远是`0`,界面会一直显示`1`,如下所示：
```javascript
function Counter() {
  let [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(0 + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
 return <h1>{count}</h1>;
}
```
那有些小伙伴会说，如果我们直接往第二个参数加`count`呢
```javascript
function Counter() {
//... 
useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [count]);
//...
}
```
这样效果是对的，但是性能不好。每当`count`更改了，`useEffect`就会渲染一次,定时器也会不停的被新增与移除。如下所示：
```javascript
//第一次
function Counter() {
//... 
useEffect(() => {
    const id = setInterval(() => {
      setCount(0 + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [0]);
//...
}
//第二次
function Counter() {
//... 
useEffect(() => {
    const id = setInterval(() => {
      setCount(1 + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [1]);
//...
//第N次
}
```
那到底要怎么做才能有保障性能，定时器只监听一次，又使定时器起作用呢？

### 方案一、函数式更新
`useState `中的set方法可接收函数，该函数将接收先前的`state`，并返回一个更新后的值。这样定时器每次拿到的是最新的值。
```javascript
function Counter() {
let [count, setCount] = useState(0);
useEffect(() => {
    const id = setInterval(() => {
      setCount(v => {
        return v + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
return <h1>{count}</h1>;
}
```
[https://codesandbox.io/embed/hooks-setinterval-usestate-grres](https://codesandbox.io/embed/hooks-setinterval-usestate-grres)

### 方案二、用useRef
`useRef`返回一个可变的`ref`对象,返回的`ref`对象在组件的整个生命周期内保持不变。
将定时器函数提取出来，每次定时器触发时，都能取到最新到`count`.
```javascript
function Counter() {
  let [count, setCount] = useState(0);
  const myRef = useRef(null);
  myRef.current = () => {
    setCount(count + 1);
  };
  useEffect(() => {
    const id = setInterval(() => {
      myRef.current();
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <h1>{count}</h1>;
}
```
[https://codesandbox.io/embed/hooks-setinterval-useref-cgif3](https://codesandbox.io/embed/hooks-setinterval-useref-cgif3)

> 思考：为什么不直接`setInterval(myRef.current, 1000)`这样写不行呢,还要包个方法返回？
```javascript
function Counter() {
  let [count, setCount] = useState(0);
  const myRef = useRef(null);
  myRef.current = () => {
    setCount(count + 1);
  };
  useEffect(() => {
    const id = setInterval(myRef.current, 1000);
    return () => clearInterval(id);
  }, []);
 return <h1>{count}</h1>;
}
```
[https://codesandbox.io/embed/hooks-setinterval-useref-error-52dm0](https://codesandbox.io/embed/hooks-setinterval-useref-error-52dm0)

下面的例子可以很好的解释。假如把`myRef.current`为`cur`变量,定时器的第一个参数为`interval`变量，`cur`变量更改，`interval`的取的还是之前赋值的值。
```javascript
var cur=()=>{var count=0;console.log(count)};
var interval=cur;
var cur=()=>{var count=1;console.log(count)};
interval();//0

var cur=()=>{var count=0;console.log(count)};
var interval=()=>{cur()};
var cur=()=>{var count=1;console.log(count)};
interval();//1
```


### 方案三、自定义hook

可以写个自定义`hook`，方便重复使用。
```javascript
function useInterval(fun) {
  const myRef = useRef(null);
  useEffect(() => {
    myRef.current = fun;
  }, [fun]);
  useEffect(() => {
    const id = setInterval(() => {
      myRef.current();
    }, 1000);
    return () => clearInterval(id);
  }, []);
}

function Counter() {
  let [count, setCount] = useState(0);
  useInterval(() => {
    setCount(count + 1);
  });
  return <h1>{count}</h1>;
}
```
[https://codesandbox.io/embed/hooks-setinterval-ownhooks-0tpxe](https://codesandbox.io/embed/hooks-setinterval-ownhooks-0tpxe)

### 方案四、用useReducer
将`count`变量存入`reducer`中，使用`useReducer`更新`count`
```javascript
function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return state + 1;
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, 0);
  useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: "increment" });
    }, 1000);
   return () => clearInterval(id);
  }, []);
  return <h1>{state}</h1>;
}
```
[https://codesandbox.io/embed/hooks-setinterval-usereducer-2byrm](https://codesandbox.io/embed/hooks-setinterval-usereducer-2byrm)

还有什么好的方案欢迎小伙伴们留言评论～～

Happy coding .. :)

### 相关链接
[https://zh-hans.reactjs.org/docs/hooks-effect.html](https://zh-hans.reactjs.org/docs/hooks-effect.html)

[https://zh-hans.reactjs.org/docs/hooks-reference.html](https://zh-hans.reactjs.org/docs/hooks-reference.html)

[https://overreacted.io/making-setinterval-declarative-with-react-hooks/](https://overreacted.io/making-setinterval-declarative-with-react-hooks/)




