---
author: raoenhui
layout: post
title: "假设最后一个css元素是html标签，则选择器解析从左往右的提案"
date: 2019-03-30 16:00
categories : Css
comments: true
tags:
- Css
---

## 现状
现在浏览器css匹配核心算法的规则都是是以` right-to-left `方式匹配节点的。

如.root .sub span {...}，浏览器渲染方式是 span -> .sub -> .root
它的读取顺序变成：先找到所有的`span`，沿着`span`的父元素查找`.sub`,再找`.root`，中途找到了符合匹配规则的节点就加入结果集；如果直到根元素html都没有匹配，则不再遍历这条路径，从下一个`span`开始重复这个过程。

## 举例
如果整个`html`只有一个`span`标签，那` right-to-left `方式的确是最快的，但是往往大部分网页都不只一个`span`标签，多个`span`标签将会有很多无效的匹配，那这时是不是` left-to-right `会更好一点。

案例：
```html
<html>
  <div class="root">
    <div class="sub"><span>1</span></div>
  </div>
  <div>
    <div><span>2</span></div>
  </div>
  <div>
    <span>3</span>
  </div>
  <span>4</span>
</html>
```
```css
.root .sub span {}
```
![domTree.png](https://raoenhui.github.io/images/190330/1.jpg)


` right-to-left `解析
先找到所有的最右节点` span`，有4个，对于每一个 `span`，向上寻找节点发现不是`.sub`,在查找上上节点，直到找到`html`，发现没有符合的。再从下一个`span`开始重复这个过程。
上面情况有4个`span`至少有4个分支的往上遍历。假如有 1000 个 不在`.sub`中的`span`，就有 1000 次的分支遍历，而符合条件的只有1个，会损失很多性能。

` left-to-right `解析
从 `.root `开始,遍历所有子节点，如果没有找到`.sub`，回溯到上个节点接着遍历，直到找到`.sub`，再遍历`.sub`下的子节点找到`span`结束。
上面情况1次就能找到符合条件的`span`。

上面案例明显` left-to-right `比` right-to-left `解析效率更高。

当然也有情况是，如果`.root`下面有很多复杂子节点，需要遍历与回溯很多次，而`.root`外的`span`不多，则` right-to-left `解析效率更高。

## 提案
大部分书写习惯是不想每个`html`标签都加`class name`，可以用不同`html`标签选择出来的。如下所示：
```html  
<div>
  <div id="sub">
    <span>1</span><label>2</label><div>3</div>
  </div>
  ...  <!-- 里面有很多span，label，div标签 -->
</div>
```
```css  
#sub span{}
#sub label{}
#sub>div{}
```
先找到`#sub`再找`html`标签的话，css解析效率会高些。
那么` left-to-right `比` right-to-left `解析效率高。
所以提案如下：

**假设最后一个css元素是html标签，而父元素有ID或Class选择器时，则选择器解析从左往右的，其他情况还是从右往左。**

> Ps：这里本妹子的一个想法，欢迎各位小伙伴们一起讨论，如果大部分都觉得有道理的话，我想试着向`w3c`组织提出建议需求。

Happy coding .. :)