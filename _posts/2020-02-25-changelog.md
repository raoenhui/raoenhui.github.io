---
author: raoenhui
layout: post
title: "Git message规范Change log编写指南"
date: 2020-02-25 8:07
categories : git
comments: true
tags:
- git
---

本文案例为[https://github.com/raoenhui/react-example/tree/changelog](https://github.com/raoenhui/react-example/tree/changelog)，欢迎下载查看。

### 1.介绍Commit message 的格式
项目的 `Git Commit Message` 参考了 [AngularJS 规范](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y)
```bash
<type>(<scope>): <subject>
// 空一行
<body>
// 空一行
<footer>
```
`type` 类型，修改的类型级别:
- feat: 新功能
- fix: 修补 Bug
- docs: 文档
- style: 格式变更，不影响代码的运行
- refactor: 重构（既不是新增功能，也不是修改 bug 的代码变动）
- test: 增加测试
- chore: 构建过程或辅助工具的变动
- up: 不属于上述分类时，可使用此类别
- merge: 用于 merge branch 时，需要手写 commit message 的情况
- revert: 用于撤销之前的 commit

`scope` 修改范围，主要是这次修改涉及到的部分，最好简单的概括
`subject` 修改的副标题，主要是具体修改的加点
`body` 修改的主体标注
`footer` 放置不兼容变更和Issue关闭的信息


### 2.生成符合格式的 Commit message
现在根目录下新建`commitlint.config.js`配置文件
```javascript
module.exports = { extends: ['@commitlint/config-angular'] };
```
在安装`commitizen`包
```bash
npm install -g commitizen
npm install  cz-conventional-changelog -D
commitizen init cz-conventional-changelog -D
```
将会自动生成：
```json
"config": {
    "commitizen": {
      "path": "./node_modules/cz-conventional-changelog"
    }
  }
```
运行`git cz`
或者
给`package.json`添加脚本`scripts`
```javascript
{
"commit": "git-cz"
}
```
如下所示
![image.png](https://img30.360buyimg.com/pop/jfs/t1/107730/21/7191/152317/5e5725ecE91915563/2c45ecffdff4b8fe.png)

### 3.限制提交的git message
安装`git`钩子`husky`，并配置
```bash
npm i -D husky
```
```javascript
{
"husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -e $GIT_PARAMS"
    }
  },
}
```
安装message提交规范插件  `commitlint`
```bash
npm i -D @commitlint/config-conventional @commitlint/cli，
```
并配置

```javascript
{
"commitlint": {
    "extends": [
      "@commitlint/config-conventional"
    ]
  }
}
```
![image.png](https://img30.360buyimg.com/pop/jfs/t1/91068/3/13274/151505/5e572606Ecdffdbfb/f70192f7f1cd9264.png)

原理是在`git`的钩子文件中添加钩子，打开钩子文件夹，都会存在一份带有`.sample` 的，一份不带`.sample` 的，`git`在执行提交的时候会先运行新增不带`.sample`的钩子文件。如果
```bash
node_modules/_run-node@1.0.0@run-node/run-node "$scriptPath" $hookName "$gitParams"
```
![image.png](https://img30.360buyimg.com/pop/jfs/t1/86746/5/13260/846538/5e57260dE529436fb/b58be87f534e5c83.png)

> 如果没有此文件，则安装husky失败，请运行npm rebuild

### 4.Eslint配置
审查代码编码规范，统一代码风格。
```bash
cnpm i eslint  lint-staged
```
```javascript
"scripts": {
     "eslint-fix":{
        "eslint-fix": "eslint --fix --format codeframe 'src/**/*.{js,jsx}'
      }
},
"husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -e $GIT_PARAMS"
    }
  },
  "lint-staged": {
    "src/**/**.js": [
      "eslint --fix",
      "git add"
    ]
  }
```
![image.png](https://img30.360buyimg.com/pop/jfs/t1/109343/18/7039/97064/5e57260fEb3eba33e/0ab3d86fed69cc80.png)

### 5.新增标签tag
自动生成新的`tag`，并产生`changlog`
```bash
cnpm i standard-version -D
```
```javascript
{
"release": "standard-version",
}
```
可以由"standard-version"自动加`1`生成`tag`,而且会更改`package.json`中的`version`字段。
也可以自己指定生成对应的`tag`
```bash
npm run release -- --release-as 1.0.0
```
![image.png](https://img30.360buyimg.com/pop/jfs/t1/100585/3/13460/175054/5e572612E06446de3/9924911caef2d265.png)


### 6.生成changelog
当然也可以不加`tag`，自己生成`changelog`。给`package.json`添加脚本`scripts`
```bash
npm install conventional-changelog-cli -D
```
```javascript
{
"changelog": "conventional-changelog -p angular -i CHANGELOG.md -s -r 0"
}
```
> -s --same-file 输出到指定文件CHANGELOG.md
> -r 0 --release-count tag生成数量，0为重新生成整个变更日志，包含所有tag

![image.png](https://img30.360buyimg.com/pop/jfs/t1/108228/37/7150/134955/5e57261fEb39e4649/fc8309a15aec5798.png)


Happy coding .. :)

### 相关文档

[案例](https://github.com/raoenhui/react-example/tree/changelog)

[AngularJS Git提交信息规范](https://segmentfault.com/a/1190000004282514)

[Commit message 和 Change log 编写指南](https://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)

[changelog案例](https://github.com/raoenhui/react-example.git)




