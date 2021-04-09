---
author: raoenhui
layout: post
title: "H5动画实战浅析"
date: 2021-01-02 22:07
categories : React
comments: true
tags:
- React
---

### 前言
动画效果一直是人机交互的一个非常重要的部分，动画效果的引入，会让交互变得更加友好，让用户获得更加愉悦的体验。而随着市场环境变化，手机性能越来越好，网速越来越快，以及用户视觉效果要求越来越高，作为一名网页开发者，动画也是一个必会的技能。由此本文和大家分享下动画方面的技术实践经验。

### 动画的形成
多张不同的图像连在一起就会变成了动态的图像。在网页端的世界里，浏览器在视觉暂留时间内，连续不断的逐帧输出图像。每一帧输出一张图像，形成了用户视觉效果中的动画。那么怎么高效的通过一帧帧输出连续流畅的动画，是有很多种动画技术可以都可以实现的。

### 动画技术
下面以当今主流的动画技术，分成四个部分给大家介绍下，分别为`纯Css`、`Lottie库`、`Svga库`、`Creatjs库`。

#### 一、纯CSS

1.1 `Animation`动画属性主要结合`@keyframes`规则来创建动画。

下面以语音喇叭声波动效为例：
中间的小圆点是一直存在的，第一条和第二条线都是`1/4`的圆弧，分别间隔`0.2s`去循环显示隐藏。

![声波动效.gif](https://img14.360buyimg.com/imagetools/jfs/t1/141819/25/2260/19854/5f02bf7dE7860564a/420b5e7f2d771181.gif)

```css
.second {
    animation: fadeInOut 1s infinite 0.2s;
}
.third {
   animation: fadeInOut 1s infinite 0.4s;
}
@keyframes fadeInOut {
  0% {
    opacity: 0;
    /*初始状态 透明度为0*/
  }
  100% {
    opacity: 1;
    /*结尾状态 透明度为1*/
  }
}

```

我们一般用阶跃函数`step`来做帧动画。
下面是`linear`和`step`的具体案例：

[https://codepen.io/huihui/pen/ExPKbdj](https://codepen.io/huihui/pen/ExPKbdj)

先生成`Sprite`图片，再移动`X`轴位置形成帧动画。

![image1.png](https://img11.360buyimg.com/imagetools/jfs/t1/143380/10/2197/40201/5f02c24aE396b2557/40e8c2e0b16dbde8.png)

![linear-step.gif](https://img12.360buyimg.com/imagetools/jfs/t1/146702/25/2252/262783/5f02bf79Ebe245e02/6541b4eaed704ff9.gif)

1.2 `Transform`属性应用于元素的2D或3D转换。该属性允许我们对元素进行旋转、缩放、倾斜、移动、透视以及使用矩阵函数。分别为`rotate`，`scale`，`skew`，`translate`，`perspective`以及`matrix`。还可以通过`transform-origin`用来确定中心点的位置为`X、Y、Z`，默认值：50% 50% 0。
这里有个很好的例子来演示`Transform`属性：[https://c.runoob.com/codedemo/3391](https://c.runoob.com/codedemo/3391)

![transform.gif](https://img14.360buyimg.com/imagetools/jfs/t1/128709/15/6373/1245938/5f02bf73E28c5ed08/e90dc4bffbb8643c.gif)

下面以翻牌动效为例，主要是通过透视`perspective`属性来实现：

要达到图中`第一组翻牌`的效果。首先设置`transform-style: preserve-3d`，使被转换的子元素保留其`3D`转换。如果不加透视距离`perspective`，则会为`第三组翻牌`中的效果，扁平没有`Z`轴的立体感。其次添加了透视距离后，如果`Z`轴相同，三个卡片是会有重叠的现象，如`第二组翻牌`中的效果。最后特意给`卡片一`加大了`Z`轴距离。这样通过透视，如果`Z`轴距离越大，卡片就看上去越小。可以用`scale`放大了`卡片一`。

![排行榜翻牌.gif](https://img13.360buyimg.com/imagetools/jfs/t1/134606/34/3659/2704483/5f02bfe2E51d75eec/165d1cf13a02d82e.gif)
```css
.card-board{
  perspective: 800;
}
.board-item-wrap1{
  transform: scale(1.1) translateZ(-100px);
}
```
> 提示：一般用`transform: translateZ(0)`，开启`3D`引擎，触发`GPU`加速，让网页动画更流畅。

1.3 `Transition`属性是用来设置动画过渡效果的，可以设置动画的过渡时间和延迟时间。还可以添加动画函数`animation-timing-function`，其默认值为`ease`。可用贝塞尔曲线来做为动画速度曲线，推荐一个贝塞尔曲线的可视化网址：[cubic-bezier](https://cubic-bezier.com/)，

![贝塞尔曲线.gif](https://img13.360buyimg.com/imagetools/jfs/t1/127825/40/6414/2239448/5f02bf9dEee84d3fe/c295f209d53c247c.gif)
以地图页的动画为例：
品牌岛屿的移动效果用了`ease`，由于后面的品牌需要模糊，设置了较晚模糊的贝塞尔曲线

![map.gif](https://img13.360buyimg.com/imagetools/jfs/t1/149207/6/2205/2691714/5f02bf8fE599376e3/5ad1a4f941c5ec9c.gif)

```css
transition: transform 1s ease,filter 1s cubic-bezier(.06,.45,.82,1.34);
```
[https://cubic-bezier.com/#.06,.45,.82,1.34](https://cubic-bezier.com/#.06,.45,.82,1.34)

![image2.png](https://img14.360buyimg.com/imagetools/jfs/t1/142516/29/2186/60587/5f02c25fEd01ed66d/b75a10768a1785aa.png)

1.4 `Js`动画事件监听：
动画事件有：
> [animationstart](https://www.runoob.com/jsref/event-animationstart.html) - CSS动画开始后触发

> [animationiteration](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/animationiteration_event)- CSS 动画重复播放时触发

> [animationend](https://www.runoob.com/jsref/event_animationend.html) - CSS动画完成后触发

过渡事件有：
>[transitionend](https://developer.mozilla.org/zh-CN/docs/Web/Events/transitionend)- 该事件在 CSS 完成过渡后触发。

注意：`transitionend`存在个问题.如果`transition`中,变换的属性有多个，就会触发多次。比如如果同时设置宽高的过渡效果（transition:width:.2s,height:.2s），那么`transitionend`事件就会触发`2`次。

以`2`秒消失提示框为例：

动画结束`2`秒后隐藏，用`animationEnd`事件来监听。

![toast.gif](https://img13.360buyimg.com/imagetools/jfs/t1/121570/26/6447/64338/5f02bf84Efb46e746/447697e674d5a2b7.gif)

兼容性：
上面`4`个事件都存在兼容性问题，在`Android5`下或`Ios9.3`下都需要加`webkit`前缀才能兼容，例如`animationstart`事件在`Android5`下需要用`webkitAnimationStart`。

![webkit.png](https://img11.360buyimg.com/imagetools/jfs/t1/126222/6/8970/86383/5f2babe8Ef23853ff/9ef7f1ad31e2940e.png)

兼容性这块本人封装了插件[jdyfe-eventployfill](https://www.npmjs.com/package/jdyfe-eventployfill)，原理是用`createElement`创建一个元素但是不插入页面`Dom`,查找`style`中是否有动画事件，来作为`webkit`的兼容判断
使用方法
```js
import { janimationstart, janimationiteration, janimationend, jtransitionend } from'jdyfe-eventPloyfill'
    ...
    dom.addEventListener(janimationstart, ()=>{})
    dom.addEventListener(janimationiteration, ()=>{})
    dom.addEventListener(janimationend, ()=>{})
    dom.addEventListener(jtransitionend, ()=>{})
    ...
```

#### 二、Lottie
`airbnb`提供的开源动画库[Lottie](https://github.com/airbnb/lottie-web)

> 支持多版本，`React Native`，`web`和  `iOS`， `Android` 版本

> 用矢量图导出。

> 在浏览器中生成的是`svg`标签，不会失真

案例为：
[https://codepen.io/airnan/pen/MPmQQB](https://codepen.io/airnan/pen/MPmQQB)
```js
var svgContainer = document.getElementById('svgContainer')
var animItem = bodymovin.loadAnimation({
  wrapper: svgContainer,//div的id
  animType: 'svg'
  loop: true,
  path: 'https://labs.nearpod.com/bodymovin/demo/markus/halloween/markus.json'
})
```
更多`Lottie`案例：[https://codepen.io/collection/nVYWZR/](https://codepen.io/collection/nVYWZR/)

`Lottie`还和京东的`JDReact`框架结合，推出了`JDLottieLoadingView`和`JDLottieView`组件。其中`JDLottieLoadingView`主要是显示加载中的动效，会默认引用`loading`动画样式。`JDLottieView`是`Lottie`在`JDReact`上的封装，用法不变。

案例代码如下：

```js
<JDLottieLoadingView
    autoSize={false} 
    source={"loading.json"}
/>
<JDLottieView
    autoPlay={true}
    autoSize={true}
    style={{width: 100, backgroundColor: 'black'}}
    source={require('./animations/LottieWalkthrough')}
    progress={0}
    loop={true}
/>
```

#### 三、Svga
SVGA 是一种跨平台的开源动画格式，集成 svga player 之后可直接使用，安装`svgaplayerweb`包即可，

> 支持多版本，兼容 `iOS` / `Android` / `Flutter` / `Web` 多个平台的动画格式

>  支持位图和矢量图

> 在浏览器中生成的是`canvas`标签

案例代码如下：

```js
import * as SVGA from 'svgaplayerweb'
function AniSvga(props) {
  useEffect(() => {
    var player = new SVGA.Player('#demoCanvas1')
    var parser = new SVGA.Parser('#demoCanvas1') // Must Provide same selector eg:#demoCanvas IF support IE6+
    parser.load('./plugin/mengniu.svga', function(videoItem) {
        player.setVideoItem(videoItem)
        player.startAnimation()
    })
    return ()=>{
      player.clear()
    }
  }, [])
  return (
    <div className="jdyfe-svgaPage">
      <div id="demoCanvas1" ></div>
    </div>
  )
}
export default AniSvga
```
`svga`在线预览：[https://svga.io/svga-preview.html](https://svga.io/svga-preview.html)

某些`Android`操作系统缺少`Blob`支持，所以需要自行添加`Blob Polyfill`。

![image3.png](https://img10.360buyimg.com/imagetools/jfs/t1/144654/12/2217/98830/5f02c263Ef0d528c4/76c63aa0263d8c2d.png)

```html
<script src="//cdn.bootcss.com/blob-polyfill/1.0.20150320/Blob.min.js"></script>
```

#### 四、Createjs
`CreateJS`是基于`HTML5`开发的一套模块化的工具库。
基于这些库，可以非常快捷地开发出基于`HTML5`的游戏、动画和交互应用。
###### 4.1 EaselJS 
`EaselJS`提供了`JavaScript`库，可轻松操作`HTML5 Canvas`元素。

可以绘制[Stage](http://www.createjs.cc/src/docs/easeljs/classes/Stage.html)舞台、[Container](http://www.createjs.cc/src/docs/easeljs/classes/Container.html)容器和[Sprite](http://www.createjs.cc/src/docs/easeljs/classes/Sprite.html)精灵的大小位置等，还提供很多事件可以做交互，很适合纯互动游戏制作。
精灵可以用`TexturePacker `软件来生成雪碧图，导出`Createjs`的`json`文件。

![image4.png](https://img12.360buyimg.com/imagetools/jfs/t1/122287/35/6465/589123/5f02c269E4956502e/eefad80c4e72f74a.png)

###### 4.2 TweenJs
`TweenJs`主要是调整动画属性，例如
```js
target.alpha = 1
createjs.Tween.get(target).wait(500).to({alpha:0, visible:false}, 1000).call(handleComplete)
function handleComplete() {
        //渐变完成执行
}
```
> 这个渐变将会先等待0.5秒，渐变目标的alpha属性从0到1，并且visible属性从true变为false，这个过程用时1秒，最后调用handleComplete函数。

###### 4.3 SoundJs
`SoundJs`主要用来加载处理音频的。
> 暂停，恢复 声音

> 控制声音的音量，静音

> 监听声音实例中的事件，如完成，循环，或失败事件

```js
 createjs.Sound.alternateExtensions = ["mp3"]
 createjs.Sound.on("fileload", this.loadHandler, this)
 createjs.Sound.registerSound("path/to/mySound.ogg", "sound")
 function loadHandler(event) {
     // 这会引发针对每个已注册的声音。
     var instance = createjs.Sound.play("sound")  // 发挥使用ID。也可以使用完整的源路径或event.src。
     instance.on("complete", this.handleComplete, this)
     instance.volume = 0.5
 }
```

###### 4.4 PreloadJS
`PreloadJS`是一个用来管理和协调相关资源加载的类库，它可以帮助你预先加载相关资源。对比自己写监听`load`事件来确认完成加载，`PreloadJS`更方便，并且支持预加载多种类型的数据，例如：图片、文件、音频、数据等等。
`PreloadJS`主要是用`URL. createObjectURL `创建了`Blob`对象，然后赋值给URL，移除的时候用 `URL.revokeObjectURL`方法移除`Blob`对象。所以会在`network`中看到`Blob`对象。
```js
import createjs from 'jdyfe-createjs'
const loader = new createjs.LoadQueue(true)
loader.loadManifest([bgAry[0], ...imgAry])
loader.on('complete', function () {
       console.log('complete')//全部加载完成
})
loader.on('fileload', function (e) {
       console.log('fileload---', e.target.progress)//进度条
})
```

案例

`createjs`官网不支持`npm`方式使用，我们用`webpack`重新打包生成了一个`umd`模块[jdyfe-createjs](https://www.npmjs.com/package/jdyfe-createjs)，可供大家下载和使用。

下面案例包含了上面说的`4`个模块，也用到了`jdyfe-createjs`，具体可看：[Belly跑步案例](https://github.com/raoenhui/react-example/blob/master/src/AniCreatejs/index.jsx)

![createjs.gif](https://img12.360buyimg.com/imagetools/jfs/t1/121093/28/6360/173594/5f02bf4cE49ad27a5/063274896b83e5f1.gif)

Happy coding .. :)

### 相关链接

[https://developer.mozilla.org/en-US/docs/Web/API/Animation/play](https://developer.mozilla.org/en-US/docs/Web/API/Animation/play)

[http://www.createjs.cc/src/docs/tweenjs/classes/CSSPlugin.html](http://www.createjs.cc/src/docs/tweenjs/classes/CSSPlugin.html)