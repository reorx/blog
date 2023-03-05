---
title: 谈谈我对 ChatGPT 应用的 prompt 的看法
issueno: "004"
slug: 004-prompts-and-parameters-transparancy
date: 2023-03-05T23:08:00+08:00
description: Prompt 是一个 ChatGPT 应用的灵魂，希望所有基于 ChatGPT API 的产品都能向用户公开其 prompt，保持透明，尊重用户隐私。或许我们可以发起一个由社区共同维护的 Open Prompt 开源项目？
draft: false
ShowToc: false
tags:
  - chatgpt
  - prompt
---

在[上一篇更新](/makers-daily/003-chatgpt-proofreader-extension-popclip/)中我讲到自己基于 ChatGPT API 做了一个校对和润色文字的 Popclip 插件，叫做 Popclip Proofreader。由于 ChatGPT API 本身非常简单，这个插件的核心价值其实是我调教出的可以稳定、准确完成润色这一任务的 prompt。

在见识过越来越多的新产品后，我越发认定，<mark>prompt 是一个 ChatGPT 应用的灵魂</mark>，甚至未来 prompt 本身就可以成为应用。并且 prompt 关系到用户所输入的信息如何被使用和上传（到 OpenAI），因此我衷心希望所有基于 ChatGPT API 的产品都能向用户公开其所使用的 prompt，保持透明，尊重用户隐私。更何况 prompt 的使用交流无论是对于用户还是开发者都很有价值，任何人都不必敝帚自珍。

我们正身处一场技术发展和下放所产生的时代变革之中，作为一个开发者，应该清醒地认识到，我们开发的应用的价值是由所有参与到生成式 AI 与大型语言模型的学术研究、数据训练、软件开发的学者和公司所赋予的。应带着感激和尊敬，挖掘和普及这项技术的价值，使它能够应用在更多的场景中，为更多的人带来便利。这是我关于开发 ChatGPT API 工具的使命和初心。

## Prompts for proofreading

说回正题，我来分享下 Popclip Proofreader 所使用的 prompt:
> system: I want you act as a proofreader. I will provide you texts and I would like you to review them for any spelling, grammar, or punctuation errors.
>
> user: Proofread the following content and give me the result without extra delarations or comments:

你可能会好奇，user message 似乎已经包含了足够多的信息，为什么还要有个 system message 呢？我的初衷是通过 system message 传递所有的任务要求，我给了它两个指示，1. 检查文字中的拼写、语法、标点错误并更正；2. 返回的信息不要包含额外的评论和声明。第二点的目的是为了避免输出中包含 "Here's the corrected sentence:" 这样的无用信息，但结果却不甚理想，这种声明仍然时不时会出现。

于是我查阅了 OpenAI 的文档[^1]，发现这样一段话:
> Many conversations begin with a system message to gently instruct the assistant…
> In general, `gpt-3.5-turbo-0301` does not pay strong attention to the system message, and therefore important instructions are often better placed in a user message.

也就是说，ChatGPT 对 system message 的遵从程度没有那么高，一些重要的指示最好还是放在 user message 中。所以我最终将第二个指令放在了 user message 中。但其实这么看来，system 更适合在较长的对话中定下基调，而单条信息的查询只用一条 user 来表达是最好的。

下面我收集了一些同样目的的 prompt 供读者参考和尝试。

可选项 1，来自 [ChatGPT Grammar Check PopClip Extension](https://github.com/hirakujira/ChatGPT-Grammar-Check-PopClip-Extension)
> user: Please correct the grammar and polish the following sentences, do not provide any translation, comments, or notes, and use the same language as input

可选项 2，来自读者 Yu Bai
> user: Rewrite the text in authentic English

可选项 3，来自 [OpenAI Polisher Bob Plugin](https://github.com/yetone/bob-plugin-openai-polisher)，括号部分可以去掉
> user: Revise the following sentences to make them more clear, concise, and coherent (Please note that you need to list the changes and briefly explain why)

## Other people's thoughts

其实除了 prompt, ChatGPT API 的其他参数 (parameters) 也影响最终结果的产生，因此在公布 prompt 的同时，也应该将这些参数囊括进来。推友 @mr_easonyang 甚至认为参数应该成为自定义选项，我认为这是很好的提议:

{{<social-quote-tweet id="1632090033875472384" user="mr_easonyang" />}}

推友 @daydayuuup 也表达了对 prompt 无法控制的担忧:

{{<social-quote-tweet id="1632230590362816513" user="daydayuuup" />}}

推友 @xxm459259 说 ChatGPT 类产品很容易被下游开发者复刻，我深以为然。一开始大家可能都会想把 prompt 作为壁垒，但对想要破解的人来讲，看一眼可能就猜个七七八八，自己调试下说不定效果还更好了…所以我觉得 prompt 还是公开的好，更快推动 Prompt Engineering 的发展，作为开发者也一定能在更好的环境中获利。 

{{<social-quote-tweet id="1632381501970194433" user="xxm459259" />}}

推友 yeaphgel [说到](https://twitter.com/yeaphgel/status/1632410458799095809)，**细分行业融入工作流组织化才能形成真正的壁垒**，我很认可这个观点，这样的市场环境是我希望看到的。一个有追求的产品应该在工具的深度上做竞争，而不是急功近利地圈地抢人，如果你做的东西不够好，用户最终还是会流失掉。

## The "Open Prompt" project

在写这篇文章的时候，我产生了一个想法——发起一个名为 Open Prompt 的开源项目，由社区参与者共同收集和维护各种 AI 产品的 prompt，附带详细的说明，供用户和开发者审阅和参考。与 [Awesome ChatGPT Prompts](https://github.com/f/awesome-chatgpt-prompts) 不同的是，每个产品的 prompt 都会有一个单独的页面，大家可以在这里看到 prompt 版本的变化，提交反馈和参与讨论，使这里成为 AI 爱好者们学习和交流的平台。如果读者们对此项目感兴趣，或有不同的想法，欢迎与我联系和讨论。

## The market value of AI prompt

上文中提到的，未来或许 prompt 可以直接成为应用，今天就看到了 [PromptBase](https://promptbase.com/) 这个网站，看来 “Prompt as a Service“ 已经指日可待。这个网站可以搜索和买卖各类 AI 产品的 prompts，除了 ChatGPT 和 GPT-3，还有之前备受关注的 text-to-image 领域的 Stable Diffusion, DALL-E, Midjourney 等等。我随便查看了几个 ChatGPT 的，有教你如何赚钱的 "Eary Money Now", "The Business Genie"，也有自媒体博主非常需要的 "Never Run Out Of Instagram Ideas", "Social Media Weekly Content"，价格大都在 $1.99 到 $4.99 之间，卖得好的已经有上千次出售。

看来 prompts 真的有很大的商业价值，或许我关于 prompts 与参数透明化的想法太简单了，但我仍然相信开放才是进步的源动力，就像 OpenAI 完全可以给出更高的定价，完全可以不将 API 开放，继续让更多的人购买 ChatGPT Plus，但他们却把 AI 技术下放，使人人都可低价使用和获利。这种做法的背后即便是为了更大更长远的商业利益，也是我所欣赏和赞扬的，并在事实上推动了文明的进步。

[^1]: https://platform.openai.com/docs/guides/chat/instructing-chat-models