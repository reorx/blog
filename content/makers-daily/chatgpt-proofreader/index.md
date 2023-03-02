---
title: ChatGPT Proofreader extension for Popclip
issueno: "003"
slug: 003-chatgpt-proofreader-extension-popclip
date: 2023-03-02T23:36:00+08:00
description: 做了一个校对和润色选中文字的 Popclip 插件
draft: false
ShowToc: false
tags:
  - chatgpt
---

昨天 OpenAI 在博客中介绍了新的 ChatGPT API [^1], 并且已经发布上线。这个消息令所有关注生成式 AI 开发者为之狂热，我也不例外。我有一大堆点子想要通过 OpenAI 的接口实现，而 ChatGPT API 几乎解决了旧 API 存在的所有问题。

但一个好的开发者应该是务实的，这些点子想要实现还要费一番功夫，有什么地方是马上可以用 ChatGPT API 得到改善的呢？这时我看到了 Popclip ChatGPT extension 的推文 [^2]，并立刻发现这是个非常好的点子。Popclip 是个运行在 MacOS 上的软件，它会在选中的文字上方展示一个提示栏，点击其中的按钮就可以对文字进行快捷操作，如复制、粘贴、查询字典，用户也可以安装更多扩展以实现更多的功能。

[Popclip ChatGPT extension](https://forum.popclip.app/t/a-popclip-extension-for-chatgpt-updated/1283/18) 实现了将选中的文字作为 prompt 发给 `gpt-3.5-turbo` 模型并将返回结果粘贴在下方的功能，并能保存上下文。不过我的评价是，这很 cool，但没啥用，不如直接打开 ChatGPT 网页对话。我想到我经常使用 ChatGPT 的需求之一——校对和润色文字，于是我基于这个扩展做了一个新的扩展，取名为 ChatGPT Proofreader.

## 功能和用法

ChatGPT Proofreader 提供了中英文两种语言的润色功能，用法如下：

- 选择英文后，在 Popclip 中点击钢笔图标，润色后的英文将被粘贴在选中文字的下方。
- 选择中文后，在 Popclip 中点击「润」图表，润色后的中文将被粘贴在选中文字的下方。

## 安装和配置

首先你需要运行 Popclip，然后拖拽鼠标选中下方完整的代码片段，在 Popclip 中点击 “Install Extension ChatGPT Proofreader” 即可完成安装。之后扩展会提示你输入 OpenAI 的 API Key，点击确认便完成了配置。

```js
// #popclip extension for ChatGPT
// name: ChatGPT Proofreader
// icon: iconify:fluent:calligraphy-pen-24-regular
// language: javascript
// module: true
// entitlements: [network]
// options: [{
//   identifier: apikey, label: API Key, type: string,
//   description: 'Obtain API key from https://platform.openai.com/account/api-keys'
// }]
async function chat (input, options, lang) {
  const openai = require("axios").create({
    baseURL: "https://api.openai.com/v1",
    headers: { Authorization: `Bearer ${options.apikey}` },
  });

  let messages
  switch (lang) {
    case "en":
      messages = [
        {"role": "system", "content": "I want you act as a proofreader. I will provide you texts and I would like you to review them for any spelling, grammar, or punctuation errors. Once you have finished reviewing the text, provide me with the improved text, and do not include extra declarations or comments."},
        {"role": "user", "content": input.text},
      ]
      break;
    case "zh":
      messages = [
        {"role": "system", "content": "你是我的写作助手，检查接收到的文字的拼写、语法错误，对其进行润色，向我提供修改后的文字。"},
        {"role": "user", "content": `修改和润色下面的文字，直接输出修改后的结果，不需要额外的声明:\n${input.text}`}
      ]
      break;
  }

  const { data } = await openai.post("/chat/completions", {
    model: "gpt-3.5-turbo",
    messages,
  });
  const result = data.choices[0].message;
  return input.text.trimEnd() + "\n\n" + result.content.trim();
};

exports.actions = [{
  title: "ChatGPT: proofreader en",
  after: "paste-result",
  code: async (input, options) => chat(input, options, "en"),
},{
  title: "ChatGPT: proofreader zh",
  icon: "square filled 润",
  after: "paste-result",
  code: async (input, options) => chat(input, options, "zh"),
}];
```

## ChatGPT API 的优点

ChatGPT API 打开了我们对工具的想象力，但要着手去拿它做些什么，首先需要了解其特性。我在 Twitter 发表了一个 thread [^3]来总结其优点，希望能帮助你节省一些时间。以下是完整内容:

**ChatGPT API 相比 ChatGPT 的一些优点。**

1. 显式定义角色。在新的 ChatGPT API 中，消息增加了 `role` 属性，表示其所属的角色，其中 `system` 用于定义接口的行为，比如「你是一个写作助手」， `user` 和 `assistant` 则用于区分用户输入和模型输出。这使得创造特定需求的助手变得更加清晰明确。
2. 选择性地去掉会话中的信息。ChatGPT 最大可以存储 4096 个 token（大约 16384 个英文字母）的上下文，当一个会话的内容超出这个数量，最前面的信息就会被遗忘。而 ChatGPT API 每次都要将完整的上下文传递过去，这意味着我们可以选择保留重要的信息，选择性地去掉一些无用的以避免超出限制。
3. 返回多个结果供选择。通过传递 `n` 参数，可以一次性返回多个不同的结果，适合文字润色、短内容生成等场景，避免多次重复问询。
4. 使用 `logit_bias` 参数调整特定词汇（token）在结果中出现的可能性，实现特定词汇屏蔽的功能。
5. 使用 `temperature` / `top_p` 参数调整结果的相关性和准确性。当我们需要发散思维、拓宽脑洞时，可适当调低结果的相关性；而当提供的上下文足够多，需要做精确的分析时，则可调高相关性，减少 编造内容的比重。

[^1]: [Introducing ChatGPT and Whisper APIs](https://openai.com/blog/introducing-chatgpt-and-whisper-apis)
[^2]: {{< tweet-ref "https://twitter.com/PopClipApp/status/1631040246841319427" >}}
[^3]: {{< tweet-ref "https://twitter.com/novoreorx/status/1631250035852861440" >}}