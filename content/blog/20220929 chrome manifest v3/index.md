---
title: 浅谈 Chrome Manifest V3 的优缺点
slug: understanding-chrome-manifest-v3
date: 2022-09-29T23:39:26+08:00
description: Manifest V3 会对用户有什么影响，是好是坏？最近对此终于有了一些具体的理解，来辩证地看待这一改变。
draft: false
tags:
  - chrome
  - extension
ShowToc: false
writeTime: ""
cover:
  image: 
socialLinks:
  twitter:
    user: novoreorx
    id: 
---

自从 2018 年 Google 发布 Chrome 新的 Extension API Manifest V3 以来，不时会看到反对的声音，认为它限制了扩展的能力，降低了对用户隐私的保护云云。我自己虽然是一个 Chrome 插件开发者，也第一时间使用了 Manifest V3，却没有感受到具体的变化，因此一直对这些观点所描述的问题缺乏实感。

最近阅读了一篇文章，是 AdGuard 开发基于 Manifest V3 新插件的技术性回顾:  
[AdGuard publishes the world's first ad blocker built on Manifest V3](https://adguard.com/en/blog/adguard-mv3.html)

这篇文章以 AdGuard 自身作为范例，对比 Manifest V2/V3 的差异，让我终于理解了 V3 API 变化的影响之所在。

简而言之，Manifest V3 对 AdGuard 造成了如下影响：

- **规则数量限制**
    - 每个扩展的静态规则数量被限制在了 30000 个以下，所有扩展的静态规则之和不能超过 330000 个。

        > For static rules, Chrome set a minimum guaranteed limit of 30,000 rules per extension and a total limit of 330,000 rules for all extensions installed by a single user (this also takes into account the limit of 1,000 regexp rules per extension).
    - 预设的过滤器最多 50 个，用户自定义过滤器和规则之和不得超过 5000 个。

        > blockers must use pre-set filters (no more than 50), and we have to be very selective about which filters will be available to users. Of course, you can still set your own filter manually. But don't forget the 5000 rule limit **on all** custom filters and user rules.
- **API 变更**: `onBeforeRequest` → `declarativeNetRequest`
    - `onBeforeRequest` 是 Chrome Extension 中的事件回调函数，广告屏蔽插件的工作原理就是在这个函数中使用自己的一套逻辑来判断是否要中断当前的连接。从 Manifest V3 开始，这个函数就被废除了，取而代之的是 `declarativeNetRequest`，因此 AdGuard 必须将原来的私有动态规则转换成使用 [declarative rules](https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/#rules) 所描述的新规则。
    - 而受 declarative rules 的语法所限，一些 AdGuard 原有动态规则的功能将无法被实现
    - rulesets（一组 declarative rules）只能在扩展安装和更新时加载，导致 AdGuard 失去了动态更新规则的能力

        > declarative rules must be combined into rulesets
        > 
        > Rulesets are specified in the `manifest.json` file and are loaded only when the extension is installed or updated.
- **无法获得统计信息**

    - 由于 Chrome 自己实现了一套拦截机制，Manifest V3 不会将请求的统计信息开放给生产环境下的扩展，仅能在开发模式下使用。这意味着 AdGuard 将无法真正确认到动态规则的执行情况，只能通过模拟运行来猜测规则是否可能被应用了，对于规则的维护者来说是灾难性的打击。
    
        > Chrome itself now blocks requests and shares statistics only with extensions unzipped and installed in Developer Mode
        > 
        > only show which rules may have been applied.
- **Service Workers 不能保证常驻，需要主动唤醒**
    - AdGuard 的 [cosmetic rules](https://kb.adguard.com/en/general/how-to-create-your-own-ad-filters#example-cosmetic-rule)（在网页上屏蔽元素的规则）原本运行在 `background.js` 中，这个机制在 Manifest V3 中被 Service Worker 取代，由于不能常驻后台，cosmetic rules 有一定无法生效。
    
        > When the browser stops the service worker, the extension goes into a kind of sleep mode: the declarative rules work, but the cosmetic rules that are loaded dynamically do not.

可以看出，AdGuard 这款新的 Manifest V3 插件在各方面都受到了「阉割」，无怪乎文章传达出了一种艰难求存、呼吁支持的态度。

在我看来，其实 Manifest V3 的核心非常明确，就是<mark>限制扩展对系统资源的使用</mark>。一直以来高资源占用都是 Chrome 为人诟病的痛点。相信每个用户都遇到过 CPU 或内存飙升的情景，许多人甚至说 Mac 没有 16G 以上的内存不要用 Chrome。而扩展由于在后台运行，如果出现问题，更是难以定位和管理，我想这就是 Google 的工程师想要做出改变的原因。

虽然增加了诸多限制，但我确实感受到 Manifest V3 的一些有益之处：
- Service Worker 使得扩展不再能常驻后台，让扩展所占用的资源可以被回收，降低了浏览器整体的开销
- 限制规则的数量，相当于控制了单一扩展在规则计算方面的资源使用上限
- 以无法在运行时更新为代价，declarative rules 实现了更高效的动态规则
- 不再提供请求底层的统计信息，缩短了请求生命周期中的调用链，提升了处理效率

这些变化可以让 Chrome 变得更加流畅，对于 99% 的用户来说都是好事。

未来的方向，也许 Chrome 可以提供一个 IPC 或者其他更有效率的通信方式，让另一个进程参与到请求的处理流程中，这样 ad blocker 插件的最大开销——规则匹配——就不再是效率和资源的瓶颈了。就像 LSP 的工作模式，把复杂的事情分离出来让独立的组件来做，说不定会诞生一个用 Rust 开发的新一代 rule filter engine 呢。

希望这篇文章能够帮助你理解 Chrome Manifest V3 的变化，辩证地看待它。

## 后记

昨天 Chrome 官方博客发布了一个声明 ([More details on the transition to Manifest V3](https://developer.chrome.com/en/blog/more-mv2-transition/))，将 Manifest V2 的废除时间从 2023 年 1 月向后推迟了一年:

> Starting in June in **Chrome 115**, Chrome **may** run experiments to turn off support for Manifest V2 extensions in all channels, including stable channel.
> 
> In **January 2024**, following the expiration of the Manifest V2 enterprise policy, the Chrome Web Store will remove all remaining Manifest V2 items from the store.

再来看看两年前对废除 Manifest V2 的声明:

> **January 2023**: The Chrome browser will no longer run Manifest V2 extensions. Developers may no longer push updates to existing Manifest V2 extensions.

从原本的斩钉截铁，变成现在的含糊和留有余地，看来强如 Google，想要执行一个影响全世界 65% [^1] 互联网用户的 breaking change，也不是那么容易呀。

[^1]: https://en.wikipedia.org/wiki/Usage_share_of_web_browsers#cite_ref-14
