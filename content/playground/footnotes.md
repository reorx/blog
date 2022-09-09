---
title: Footnotes
draft: true
---

生病期间，在 Twitter 上知道了 [默沙东诊疗手册](https://www.msdmanuals.cn/home) 和 [腾讯医典](https://baike.qq.com/) 两个医学参考手册 [^1]，帮助我重新梳理了对一些医学概念的认知。这个意外收获让我越发觉得，人要在任何情况下保持交流，不断更新自己。

好玩又上头，Vampire Survivors 属于仅靠优秀的机制就能支撑整个游戏体验的作品，画面几乎就是贴图平移，但并不影响其出色的游戏性（梦回 Dream Quest）。每局 20 分钟，围绕武器系统构建 Build，发现不同组合的趣味，挑战更高的收割效率。它开创了一个新的游戏模式，也带来了很多模仿者 [^2]。不过没关系，这么好玩的东西请多来点。

7月中旬受人之托要实现对一个手机 App 的模拟，我想到最快的方式是写一个符合 PWA [^22] 标准的网页。经过研究，为网页增加了 [Web app manifests](https://developer.mozilla.org/en-US/docs/Web/Manifest)，还根据 Apple 的标准添加了一些 [Safari 特有的 meta tags](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html)，最终效果非常不错，达到了像素级还原 App 的体验，之后也写一篇文章来总结下。

footnotes?
1. foo
2. bar
3. baz

最终我发现 [Vite](https://vitejs.dev/) 是最佳选择。一直以为 Vite 是 Vue 生态专属，没想到是通用的前端开发和构建工具，无论是开箱即用的流程，还是清晰的文档和 API 设计，都给我带来非常好的使用体验。[^23]

[^1]: {{< tweet-ref "https://twitter.com/novoreorx/status/1544207392002682880" >}}
[^2]: {{< tweet-ref "https://twitter.com/novoreorx/status/1557237847211798528" >}}
[^22]: 参考 [Google (web.dev) 的介绍](https://web.dev/learn/pwa/progressive-web-apps/) 和 [MDN 的介绍](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[^23]: https://twitter.com/novoreorx/status/1548366397528764416
