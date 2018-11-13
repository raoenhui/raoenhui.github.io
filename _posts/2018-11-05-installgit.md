---
author: raoenhui
layout: post
title: "centos安装高版本git"
date: 2018-11-05 22:03
categories : git
comments: true
tags:
- git
---

## 方法一
根据`git`官网所示[https://git-scm.com/download/linux](https://git-scm.com/download/linux),当操作系统为`CentOS `时，推荐[下载源码包](https://mirrors.ede.kernel.org/pub/software/scm/git/),然后编译安装。
![image.png](https://upload-images.jianshu.io/upload_images/9902136-e882a5233026b86e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

不多说了，开始干货了。
首先应该安装好必要的依赖包，省得在安装过程中出现各种问题。

```bash
yum install curl-devel expat-devel gettext-devel openssl-devel zlib-devel gcc perl-ExtUtils-MakeMaker
```

下载并编译git 
下载、解压

```bash
wget https://www.kernel.org/pub/software/scm/git/git-2.19.1.tar.gz
tar xzf git-2.19.1.tar.gz
```

编译并验证

```bash
cd  git-2.19.1
make prefix=/usr/local/git all
make prefix=/usr/local/git install
echo "export PATH=$PATH:/usr/local/git/bin" >>/etc/bashrc
source /etc/bashrc
git --version
# git version 2.19.1
```
> 如果之前用`yum`安装过需要现移除`git`，`yum remove git`

 ## 方法二
```bash
yum install git
```
> 注意：centos中用`yum`只能安装到`git`版本为`1.8.3.1`,但是现在最新的`git`包已经有`2.19.1`版本了，所以推荐方法一。

#### 参考资料

> *  [https://git-scm.com/download/linux]([https://git-scm.com/download/linux)
> *  [https://blog.csdn.net/huashao0602/article/details/53507781](https://blog.csdn.net/huashao0602/article/details/53507781)

Happy coding .. :)
