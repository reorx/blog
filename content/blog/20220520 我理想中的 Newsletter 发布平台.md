---
title: 我理想中的 Newsletter platform
slug: the-newsletter-platform-i-long-for
date: 2022-05-20
description: 一些我对 Newsletter platform 产品形态非常主观的探索和思考
tags:
  - newsletter
writeTime: 01:27
cover:
  image: null
socialLinks:
  twitter:
    user: novoreorx
    id: 1527702100708589568
---

近年来 Newletter 这种发布形式越来越受到欢迎，我也在考虑是否要创建一个自己的邮件专栏。由于我的博客是由静态网站生成器构建的，因此我也希望通过同样的方式来撰写邮件通讯。

我的设想是为博客创建一个新的路径 `/weekly`，当我在这个路径下发布文章，比如 `/weekly/2022W20/`，就触发 GitHub Actions 的 CI 任务，将文章的 HTML 通过 Newsletter 服务商的接口发送出去。

带着这个目的，我调研了市面上的一些服务，选定了 4 家进行对比。

| Name       | Pricing                                       | API | Send email via API |
| ---------- | --------------------------------------------- | --- | ------------------ |
| Buttondown | 小于 100 订阅者免费; 100~1000 收费 $9/每月    | Yes | Yes                |
| Revue      | 免费使用，无限订阅者; 付费订阅收取 5% 佣金    | Yes | No                 |
| Substack   | 免费使用，无限订阅者; 付费订阅收取 10% 佣金   | No  | No                 |
| ConvertKit | 小于 300 订阅者免费; 大于 300 收费 $9/每月    | Yes | Yes                |
| Curated    | 小于 1500 订阅者免费; 1500~2500 收费 39$/每月 | Yes | No                 |

"Send email via API" 一列表示是否可以通过 API 创建并发送邮件 (或叫 issue, broadcast，每家称呼不同)，这是我最关注的一个功能，其中只有 Buttondown 和 ConvertKit 支持，他们都是基于订阅者数量的收费模式。但每月 $9+ 的费用让我却步，我想写的是分享见闻和思考的 Weekly Newsletter，这种内容并不足以支撑起付费订阅的模式。我喜欢写作并乐意分享，但为此负担额外的费用就不大令人开心了，这也是为什么我特别感谢像 Cloudflare 这样为独立开发者考虑的公司[^1]。

> 经 EGOIST 提醒，[Mailgun](https://documentation.mailgun.com/en/latest/api-mailinglists.html#mailing-lists) 的 API 有 mailing list 管理功能，同样可以实现 Newletter 所需的订阅者管理和群发。实际上 Newsletter 的本质就是 mailing list，之前我潜意识里觉得 Mailgun, SES 这些服务只是 SMTP 协议的接口化，忽略了他们其实有一些面向邮件订阅服务开发者的高级功能。

{{<collapse "References">}}
- [Buttondown](https://buttondown.email/)
    - https://buttondown.email/pricing
- [Revue](https://www.getrevue.co/)
    - http://help.getrevue.co/en/articles/4754361-how-pricing-works-on-revue
    - https://www.getrevue.co/api
- [Substack](https://substack.com/)
    - [How much does Substack cost? – Substack, Inc](https://support.substack.com/hc/en-us/articles/360037607131-How-much-does-Substack-cost-)
- [ConvertKit](https://convertkit.com/)
    - https://convertkit.com/pricing
    - https://developers.convertkit.com/#create-a-broadcast
- [Curated](https://www.curated.co/)
    - https://www.curated.co/pricing
    - https://support.curated.co/help/api
{{</collapse>}}

## 竹白

由于订阅了 [Shyrism.News](https://shyrz.zhubai.love/) 和 [落日间](https://xpaidia.zhubai.love/)，我得知了竹白这个国内的 Newsletter 发布平台。我很喜欢它简单易用的特性和清晰可读的设计风格，甚至让我这个只相信本地编辑器的人也有了在网页上创作的冲动。

这改变了我的想法，我开始思考，基于 Newsletter 平台去管理文章和发布，再使用静态网站生成器来构建网站是否是可行的。

如果以这种架构为目标，竹白还缺少一些东西，一个更为理想的竹白应该是这样的：

- [x] 一个内容管理和发布平台

    Newsletter 平台首先其实是一个标准的 CMS
- [x] 一个 Newsletter 管理后台

    管理订阅者，收集和展示统计数据
- [x] 一个付费平台

    支持接收用户的 donation；支持付费订阅
- [ ] 提供 email subscrible API

    这个接口用于在个人网站上创建订阅表单，类似于 [Formspree](https://formspree.io/) 和 [FieldGoal](https://fieldgoal.io/)，通过 HTML 的 `<form>` 标签提交用户的订阅请求。
- [ ] 提供 headless CMS API

    让创作者可以使用 Hugo, Next.js, Gatsby 等 JAMStack 工具获取数据，自由地开发定制属于自己的网站形态。

以上几点中，竹白还有最后两点没有实现，其他我所知道的产品中，最为接近的是 [Ghost](http://ghost.io/)，除了 email subscribe API 不确定之外，其他全部都能满足。但 Ghost 是专注于网站内容的管理，最近才有 Newsletter 的功能，在专业性上会略逊于其他 Newsletter 发布平台。并且 Ghost 提供的功能太多（甚至支持 Podcast），且价格昂贵，如果我购买后只用它的 Newsletter 功能显然是非常不划算的[^2]。

## Proselog

我的朋友 [EGOIST](https://egoist.sh/) 今天发布了他开发的博客平台: [Meet Proselog: The Open Blogging Platform](https://blog.proselog.com/meet-proselog)

Proselog 的界面相比竹白更加简洁清晰，界面上处处体现出 EGOIST 特有的克制而明快设计审美，这让基于网页编辑器的创作流程变得舒适而愉悦。

Proselog 不仅仅是一个 Substack/竹白 alternative，它还是一个[开源项目](https://github.com/proselog/proselog)，意味着创作者的数据和隐私将完全由自己掌控，这与 Fediverse 系的发布平台如 [Writefreely](https://github.com/writefreely/writefreely) 的理念不谋而合。

和 EGOIST 讨论后，他表示 Proselog 的确有 headless CMS 的开发计划，这让我异常期待 Proselog 后续的发展。也许这次，我找到了那个理想中的 Newsletter 发布平台。

[^1]: Cloudflare 在[一篇文章](https://blog.cloudflare.com/r2-open-beta/)中提到: “One of our main goals has been to serve the developers who can’t negotiate large discounts with cloud vendors”
[^2]: 这里不讨论 Ghost 的 self-hosted 版本，我更希望使用 hosting 的 Newsletter 服务，因为网站已经需要自己去维护，不想再增加维护一个复杂系统的负担
