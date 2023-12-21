---
title: Debounce and Throttle
slug: debounce-and-throttle
date: 2023-12-21T20:23:46+08:00 
description: 介绍 Debounce 和 Throttle 两种频率限制手段，以具体场景为例展示两者的区别。
draft: false
tags:
  - programming
  - javascript
ShowToc: true
cover:
  image: 
socialLinks:
  twitter:
    user: novoreorx
    id: 
---

## 概念

Debounce 和 Throttle 是两种相似的频率限制手段。Debounce 顾名思义，去掉弹跳/抖动，能看出防止误操作的意味；Throttle 的意思是节流阀，更加直接了当。作为两种常见的设计模式，理解他们的工作原理和细微区别能够帮助我们写出更健壮的应用程序。

虽然是两个通用的概念，但它们的确主要在 JavaScript 中被提及和使用，究其原因，JavaScript 中常常出现连续发生的大量事件，如果不对调用频率做出限制，会产生严重的性能问题。且这些事件是可以舍弃的，一段时间内只需要产生一次有效调用即可。而在后端则很少出现这种情况，所有的事件都必须要处理，性能问题通常通过异步和分布式调用来解决。

下面是我对这两种设计模式的理解。

- **Debounce**: 将间隔不超过设定时间的多次连续调用变成一次。

    从工作原理上来讲，Debounce 会使目标函数变为延迟生效，当对其进行连续多次调用时，若前后两次调用的时间间隔不超过设定值，则前一次调用会被取消。直到某次调用后，在设定的时间内没有出现下一次调用，那么这次调用将不会被取消，从而最终被执行。
- **Throttle**: 确保一个函数被连续多次调用时，在设定时间内最多只实际执行一次。

放在一起对比的话：
- **相似之处**：Debounce 和 Throttle 都限制了函数执行的最大频率不超过每设定时间一次
- **不同之处**：在快速（间隔小于设定时间）连续调用时，Throttle 确保了函数会规律执行，但 Debounce 只有当连续调用放缓（间隔大于设定时间）时才会执行。

## 应用场景

设想如下几个场景:
1. 当用户改变网页窗口的大小后，调用一个函数以调整 UI 布局
2. 当用户在滚动浏览网页内容时，根据内容所处的位置，持续更新大纲目录中的链接高亮
3. 在一个输入框的下方，让搜索提示结果随着用户的输入持续不断地更新

我们一起来看看每个场景分别应用 Debounce 和 Throttle 会有什么样的效果，并评判哪个是更加合适的频率控制方式。

### 场景 1

用户按住鼠标不松一直改变窗口大小，使用 Debounce 的情况下，UI 在用户停顿或者松开鼠标时才会改变；使用 Throttle 的情况下，用户会观察到 UI 在拖拽窗口大小的过程中每隔一会改变一次，容易给人一种反应迟钝或卡住的错觉，因此 Debounce 是更好的选择。

### 场景 2

用户持续向下滚动鼠标滑轮，使用 Debounce 的情况下，大纲的高亮只有当用户停止滚动时才会更新。所以当用户一次性滚动很长时，只能看到一次高亮的改变，中间仿佛跳过了一般；而使用 Throttle 的情况下，随着用户滚动，高亮会稳定地以设定的时间间隔更新，因此 Throttle 是更好的选择。

### 场景 3

用户以较快地速度连续输入字符，使用 Debounce 的情况下，只有当用户停止输入时搜索提示才会更新；使用 Throttle 的情况下，搜索提示会稳定地以设定的时间间隔更新，但如果用户输入最后一个字符的时间，正好处于上一次调用后的间隔期，无法触发新的调用，那么用户所看到的提示就不是根据完整的输入内容做出的。Debounce 由于能够保证函数总是在用户停止输入时执行，是比 Throttle 更好的选择。

## 库的使用

首选 lodash，因为它是一个非常流行且久经考验的库。但如果不想让整个 lodash 混入项目的构建结果，可以安装 `lodash.throttle` 和 `lodash.debounce` 两个独立的库。如果你使用的 bundler 支持 tree-shaking，也可以通过 `lodash-es` 来 import 这两个函数，最终构建结果中只会包含与之相关的代码。

npm 狂魔 sindresorhus 也维护了两个包，[debounce](https://github.com/sindresorhus/debounce) 和 [throttleit](https://github.com/sindresorhus/throttleit), 如果你想要更简洁的实现，可以考虑使用。

下面以 `lodash.throttle` 为例，展示其如何在一个 TypeScript 项目里安装和使用 :

```bash
npm i lodash.throttle
# 还需要额外安装 `@types/` 的类型定义
npm i -D @types/lodash.throttle
```

引入和调用:

```ts
import throttle from 'lodash/throttle';

const onScroll = () = {/* 实现细节 */}

// onScroll 执行的最高频率为每 100 毫秒一次
document.addEventListener('scroll', throttle(onScroll, 100));
```

## 后续思考

这篇笔记来源于[重构 GitHub TOC Sidebar 扩展](https://t.me/reorx_share/4866)时对场景 2 的思考，之前用的是自己手写的 Debounce，在滚动过程中经常看不到 ToC 的高亮变化，这次换成了 lodash.throttle，终于达到了预期的效果。其实这三个场景我都在过往的开发经历中遇到过，并且是在不了解这两个概念的情况下独立思考出了（简陋或丑陋的）解决方案，直到最近才重新审视，阅读了相关的文章，学习了更好的实现方式。这也是为什么我在[关于状态机的短文](https://t.me/reorx_share/4864)中感叹基础知识的重要性，如果能更早地知道这两个概念，就能避免曾经在黑暗中摸索的痛苦。当然，因为自己琢磨过，当看到更系统更高级的实现时，就会有更深刻的理解，这大概是[这位推友](https://x.com/noworkforsixian/status/1737122354013360488)希望自己是通过 Vanilla JS 学习前端的原因。

{{<social-quote-tweet id="1737122354013360488" user="noworkforsixian" />}}

一言以蔽之，开发遇到困难免不了自己琢磨，但在琢磨时多想想能否将问题定义出来，符合一个已有的概念，然后去参考现实世界中系统和标准的解决方案；如果没有也无所谓，未来某一刻这种思考过程会化作某种领悟，不会白费。

## 参考资料

- [Debouncing and Throttling Explained Through Examples](https://css-tricks.com/debouncing-throttling-explained-examples/): css-tricks 的经典老文
- [Debounce vs Throttle: Definitive Visual Guide](https://kettanaito.com/blog/debounce-vs-throttle): 用动态可交互的方式展现了 Throttle 和 Debounce 的差异，非常推荐阅读
- [THROTTLE.JS](https://underscorejs.org/docs/modules/throttle.html): underscore 的 throttle 源码
- [_.debounce](https://lodash.com/docs/4.17.15#debounce): lodash 的 debounce 文档