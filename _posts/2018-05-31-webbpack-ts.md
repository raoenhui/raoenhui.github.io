---
author: raoenhui
layout: post
title: "Typescript合成Webpack中"
date: 2018-05-31 21:00
categories : Typescript
comments: true
tags:
- Typescript
---

##  前言


TypeScript是JavaScript类型的超集，它可以编译成纯JavaScript，简称ts。相对于ES6,TypeScript最大的改善是增加了类型系统，国内外很多大型工程都用它，如AngularJs,白鹭引擎、Antd。

下面我将在React&Webpack代码库下基础下搭建TypeScript开发环境。

## 安装


### 第一步 安装React相关包的声明文件

可直接安装npm包，一般包前面加@types，就是加载该包的声明文件以.d.ts结尾

```bash
 npm install --save @types/react @types/react-dom @types/react-router-dom @types/react-redux
```
或 安装typings包进行搜索安装

```bash
 # Install Typings CLI utility. 
 npm install typings --global
 
 # Search for definitions. 
 typings search react
 
 typings install react --save
```


### 第二步 安装Webpack对应的加载器loader

awesome-typescript-loader是typescript官网推荐的loader，ts-loader是wepack官网推荐的loader，两者用法一样都可用，但是要注意版本。

```bash
  # 安装Ts
  npm install typescript --save-dev
  # 安装Webpack的ts loader
  npm install awesome-typescript-loader --save-dev
  npm install ts-loader --save-dev
  # 安装源文件，方便调试
  npm install source-map-loader --save-dev
```


提示

> 如果你的webpack版本是^4.0.0,则安装 awesome-typescript-loader的^5.0.0版本， 或ts-loader的^3.5.0版本

> 如果你的webpack版本是^3.0.0,则安装 awesome-typescript-loader的^4.0.0版本， 或ts-loader的^4.3.0版本



### 第三步 修改Webpack配置文件

```javascript
module.exports = {

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx',".ts", ".tsx"],
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            // { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
            { test: /\.tsx?$/, loader: "ts-loader" },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    }
};
```



### 第四步 新建Ts配置文件

新建tsconfig.json,

```json
{
  "compilerOptions": {
    "outDir": "./ts/",
    "sourceMap": true,
    "noImplicitAny": true,
    "target": "es6",
    "jsx": "react",
    "allowJs": true,
    "moduleResolution":"node"
  },
  "include": [
    "./src/**/*"
  ],
  "exclude": [
    "node_modules"
  ],
  "files": [
    "./node_modules/immutable/dist/immutable.d.ts"
  ]
}
```
> * outDir：输出文件夹路径
> * sourceMap：是否要源码；
> * noImplicitAny:是否警告any类型
> * target:编译目标语法
> * allowJs：允许所有js文件可编译
> * moduleResolution:模块解析策略
> * include:ts存放目录
> * exclude：编译排除目录
> * file:ts文件，编译包含'include'和'file'指定的文件。


### 下面可以尽情编写TS文件了

```javascript

import * as React from "React";
import Baseinfo from "./baseinfo/baseinfo";
import { Switch, Route,Link } from 'react-router-dom';
import {is, fromJS} from 'immutable';


export interface Props { match: {url:string}}


export class ConvertBean extends React.Component<Props, {}> {
    constructor(props:Props) {
        super(props);

    }

    shouldComponentUpdate(nextProps:any, nextState:any) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }

    render() {
        const { match } = this.props;
        return (
            <div className="toast-wrapper">
                <Link to={`${match.url}/baseinfo`}>baseinfo</Link>
                <Switch>
                    <Route path={`${match.url}/baseinfo`} component={Baseinfo}/>
                </Switch>
            </div>
        );
    }
}

```


> *  [https://www.typescriptlang.org/docs/handbook/react-&-webpack.html](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html)
> *  [https://github.com/Microsoft/TypeScript-Handbook/pull/767](https://github.com/Microsoft/TypeScript-Handbook/pull/767)
> *  [https://www.tslang.cn/index.html](https://www.tslang.cn/index.html)
> *  [http://json.schemastore.org/tsconfig](http://json.schemastore.org/tsconfig/)


Happy coding .. :)
