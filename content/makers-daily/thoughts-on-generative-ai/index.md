---
title: Some random thoughts on Generative AI
issueno: "002"
slug: 002-thoughts-on-generative-ai
date: 2023-02-08T21:40:37+08:00
description: ChatGPT 带来的震动一次又一次出圈，生成式 AI 领域的大型科技与商业竞争正在白热化。在这个人人都在谈论 AI 的时刻，我也有几个观点想要分享一下。
draft: false
ShowToc: false
tags:
---

ChatGPT 带来的震动一次又一次出圈，最近也在不断地看到各类基于 GPT 的新产品。科技圈里，Google 刚刚宣布了 Bard [^1]的消息没两天，Microsoft 便发布了与 ChatGPT 结合的 Bing 和 Edge [^2]，两大巨头在生成式 AI 领域的大型科技与商业竞争正在白热化。在这个人人都在谈论 AI 的时刻，我也有几个观点想要分享一下。

## What's next for GPT-based products?

目前我认为基于 GPT 的 Generative
 AI 最适合做的事情也是最强的功能之一就是 summarization——生成摘要。群聊 tldr (https://chat-simplifier.imzbb.cc/) 是个好点子，但是缺少 integration ，使用上的不便使其节省时间的价值大打折扣。

我设想一个 telegram chat tldr 工具，它会持续同步聊天记录的 archive。当我一觉起来看到一个群 999+未读，我可以向它询问最近12小时的聊天摘要；或者工作了一下午，看到300+条未读，我也可以指定要最近300条的摘要。它会先查询消息再格式化后输入给 OpenAI API 得到结果。

与其他短文本的信息服务整合也同理，如 twitter archive（过去一周我在关注什么？心情如何？吃了什么？）；twitter timeline（这几天中英文 tl 分别在讨论什么？）；rss news headlines（概述一下过去一个月的热点事件）。

应用到笔记软件，可以把一段时间的 daily notes 生成出 weekly/monthly summary，适合雇员写周报，或者PKM实践者做总结。

现在 GPT 虽然可以给个人用，却都是基于通用的数据集，只能短暂而有限地使用个人数据，比如 ChatGPT 所能保存的上下文最多为3000词。下一步突破，我希望是做到人人都可以用个人的大量数据（浏览器历史记录、所有看过的文字）持续输入，训练出专属的 AI，届时我们便能得到“上周我看过一个关于xx的网页或者推文，帮我找找是哪个”这种问题的答案了，或可诞生 GPT-powered personal search engine 这样的产品。

## 新技术的应用时机

OpenAI 和 ChatGPT 的成功，以及仅仅月余便百花齐放的 GPT-based products 给我的另一个启发是：**当一个新技术成就了革命性的产品，技术便会下放，此时才是它被广泛应用的最好时机**。

收藏工具 [mymind](https://mymind.com/) 发布时，距离 ChatGPT 的出现还有一两年时间。mymind 一开始就给自己贴上了 AI 的标签，标榜为新一代的智能收藏工具，做了 AI 分析、摘要、搜索等功能，但整体的市场反响却平平。为何 mymind 没有得到足够多的关注呢？我认为主要是因为在 ChatGPT 之前，AI 被喊了太多年，就像「狼来了」的故事，人们早已失去了开始的好奇心，见怪不怪了。而彼时 AI 技术的确没有突破性的价值，加上过于滥用，最终成了廉价的噱头，在国内科技界尤其如此。

直到 ChatGPT 横空出世，带来了十倍、百倍于之前的 AI 产品的提升，这才重使人们燃起对 AI 的兴趣和热情。而 OpenAI 提供的 API 使任何产品都可以方便地接入，实现接近 ChatGPT 的 AI 功能，大大降低了 AI 技术的应用门槛。此时虽然利好 AI 相关的产品，但 mymind 所宣传的功能不再具有壁垒，未来也没法有很强的竞争力。因此我认为 mymimd 在 AI 上投入是创新的、值得肯定的，但从收益上来看是个失败案例。


[^1]: [Google AI updates: Bard and new AI features in Search](https://blog.google/technology/ai/bard-google-ai-search-updates/)
[^2]: [Reinventing search with a new AI-powered Microsoft Bing and Edge, your copilot for the web - The Official Microsoft Blog](https://blogs.microsoft.com/blog/2023/02/07/reinventing-search-with-a-new-ai-powered-microsoft-bing-and-edge-your-copilot-for-the-web/)