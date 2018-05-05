---
author: raoenhui
layout: post
title: "node自动生成最新tag版本"
date: 2018-03-30 20:00
categories : NodeJS git
comments: true
tags:
- NodeJS
- git
---

## 第一步 引入所需要的包

```javascript
//git命令组件
const Git = require('simple-git');
//获取路径
const Path = require('path');
const GitPath = Path.resolve(__dirname, '..');
//为git的version添加自动增长版本号组件
const Bump = require('bump-regex');

```

## 第二步 生成并提交tag号

* 先pull获取最新tag版本
* 然后用bump自动增加最小版本号
* 添加日期备注
* 将tag推送到远端

``` javascript

var newVersion,//新标签
    versionHint;//新标签的备注
// update repo and get a list of tags 
Git(GitPath)
    .pull()
    .tags(function(err, tags) {
        var oldVersion = tags.latest;
        Bump('version:' + oldVersion.substr(1, oldVersion.lenght), function(err, out) {
            //产生新代码
            newVersion = 'v' + out.new;
            //产生新标签的备注
            versionHint = 'Relase version ' + newVersion + ' in ' + new Date();
            //推动到远端
            Git(GitPath).addAnnotatedTag(newVersion, versionHint, function() {
                Git(GitPath).pushTags('origin', function() {
                    console.log(versionHint);
                })
            });
        });
    });
```


Happy coding .. :)
