---
title: 我的 Vim 自动补全配置变迁史
slug: the-history-of-my-vim-completion-config
date: 2022-05-07
description: 记录了从 2017 年至今，我的 Vim 自动补全配置的每次变更，从中窥见 Vim 生态发展的一角，也纪念这些曾经给我带来过便利，最终在技术发展中被轮替的插件
tags:
  - vim
cover:
  image: images/vim-completion-2022@2.png
ShowToc: true
---

Vim 是我系统学习的第一个终端编辑器，从学生时代至今，我几乎每天都会使用到它（长时间写前端代码时除外）。

自动补全（auto completion）大概是每个 Vim 用户在掌握了基本用法后，第一个想要进阶配置的功能。这篇文章记录了从 2017 年至今，我的 Vim 自动补全配置的每次变更，从中窥见 Vim 生态发展的一角，也纪念这些曾经给我带来过便利，最终在技术发展中被轮替的插件。

## Before 2017

2017 年我从 Vim 切换到 [Neovim](https://neovim.io/)（下文简称 nvim），除了增加 nvim 特殊的 `init.vim`，基本沿用了以往的配置和插件。

彼时我使用的语言以 Python 为主，自动补全插件为 [jedi-vim](https://github.com/davidhalter/jedi-vim)。

我对 jedi-vim 的了解最早可以追溯到 2012 年，那时还没有 LSP 的概念。开发者们针对自己的需求，编写如语法增强、文档查看、自动补全等各类插件，非常零散。jedi-vim 对这些插件的功能进行了重构和集成，提供了开箱即用的统一解决方案，一经推出便广受好评，成为使用 Vim 进行 Python 开发的标配。在后来的十年里，它的初心始终不变，得到持续的维护并沿用至今。

## 2017

还是 2017 年，在切换到 nvim 后不久，我发现了 [deoplete](https://github.com/Shougo/deoplete.nvim) 插件，经过一番尝试将 jedi-vim 替换成了 deoplete + deoplete-jedi。

Commit: [0760ba6f7d11526e38e15b36a0d1db8709834825](https://github.com/reorx/dotfiles/commit/0760ba6f7d11526e38e15b36a0d1db8709834825)
> **use deoplete, remove jedi-vim**
> 
> *committed on Jun 28, 2017*

```diff
-Plug 'davidhalter/jedi-vim', { 'for': 'python' }
+Plug 'Shougo/deoplete.nvim', { 'do': ':UpdateRemotePlugins' }
+Plug 'zchee/deoplete-jedi', { 'for': 'python' }
```

deoplete 的目标是提供一个通用的异步自动补全框架，这在设计理念上是一个巨大的进步。jedi-vim 虽然开箱即用，但却是一堆粘合在一起的 spaghetti code，不仅随着项目功能的增加变得越发庞大和迟缓（这是我想要离开 jedi-vim 的主要原因，文件一大各种操作都变得肉眼可见的慢），代码的可读性也非常糟糕，难以维护和参与。而 deoplete 本身并不提供针对任何语言的分析能力，只专注于与 nvim 的整合和 completion source 的调度，并且利用 nvim 的异步功能（后来 vim 8 也推出了自己的 async 接口），大大提升了补全的流畅度。

但 deoplete 也有着自身的局限性。首先配置变得复杂且麻烦，用户得理解其架构和设计，学会如何通过 deoplete 对接编程语言的 completion source。为了使检查结果的提示贴合自己的使用习惯，还要再去学习 completion source 的配置，每个语言的实现不同，配置也不一样。

> 当时我却没有料到，配置复杂的问题在 LSP 时代不仅没能得到解决，反而变本加厉，直到本文完成时也依旧是使用者的巨大痛点

deoplete 的第二个问题是，它只专注在 completion，缺少对于 go to definition 和显示 function siguature 等功能的支持，这对于从 jedi-vim 的 all-in-one 体验切换过来的我，显然是个巨大的落差。好在我找到了其他插件来解决这些问题。

对于 “go to definition”，通过装回 jedi-vim 并打开无补全模式可以解决。这样既可以使用 jedi 提供的 go to definition 等辅助功能，也不会与 deoplete 的补全产生冲突。

```vim
Plug 'davidhalter/jedi-vim', { 'for': 'python' }

" jedi (only for go to definition)
let g:jedi#completions_enabled = 0
```

对于 “function signature”，我找到了 deoplete 作者的另一个插件 [echodoc](https://github.com/Shougo/echodoc.vim) 来实现。它将函数的签名信息显示在 cmd 区域，规避了 deoplete 占用 `completeopt` 导致编辑界面无法显示补全菜单以外的其他信息的问题。

```vim
Plug 'Shougo/echodoc.vim'

" echodoc
set noshowmode
let g:echodoc#enable_at_startup=1
```

## 2018

2018 年是里程碑式的一年，[Language Server Protocol](https://microsoft.github.io/language-server-protocol/) 的生态逐渐成熟，新的补全工具涌现。我对 LSP 感到相当兴奋和好奇，迫不及待地从 deoplete 更换到了对 LSP 有更好支持的 [ncm2](https://github.com/ncm2/ncm2)。

Commit: [7a1442c2334673ac17162c101663e220ef43a3c8](https://github.com/reorx/dotfiles/commit/7a1442c2334673ac17162c101663e220ef43a3c8)
> **nvim: update completion plugins (a lot!)**
>
> - move and reorg completion plugins definitions and configurations
> - use LSP completion instead of deoplete
> - remove eslint from ale_linters
> - enable virtualenv display for airline
> - still working on passing settings to pyls through LanguageClient-neovim
>
> *committed on Dec 7, 2018*

```diff
-Plug 'Shougo/deoplete.nvim', { 'do': ':UpdateRemotePlugins' }
-Plug 'zchee/deoplete-jedi', { 'for': 'python' }
+Plug 'ervandew/supertab'
+Plug 'ncm2/ncm2'
+Plug 'roxma/nvim-yarp'
+Plug 'autozimu/LanguageClient-neovim', { 'branch': 'next', 'do': 'bash install.sh', }
```

从设计理念上看，ncm2 与 deoplete 并无差别，都是通用的异步自动补全框架，唯有与[静态分析](https://en.wikipedia.org/wiki/Static_program_analysis)器的集成方式不同，deoplete 是自己的私有协议，ncm2 则拥抱了更加通用的业界标准 LSP。

我为 deoplete 的作者感到惋惜，他在 LSP 还不够成熟的时期，自己设计了与静态分析器的集成协议，构建了一个完整的补全插件生态[^1]。还写了很多小巧实用的插件，代码也非常优美，让人感到赏心悦目。但因为 LSP 的发展和新一代更加 LSP native 的补全插件的涌现，它已不再是当下的第一选择，势必因为历史包袱而逐渐被淘汰。

说回 ncm2，其实它也有许多瑕疵，印象中配置过程比 deoplete 还要痛苦，但当时已经是让 nvim 用上 LSP 的最好插件了。之后我对 JetBrains 和 VSCode 的使用频率变高，疏于对 nvim 插件的持续跟进，ncm2 于是一直服役到 2021 年。

ncm2 出现后没过多久，[coc](https://github.com/neoclide/coc.nvim) 也诞生了，在 2019 年成为最受人关注的 vim 补全插件，国内也看到很多文章（似乎作者就是国内开发者）。当时我简单了解后因为它是 nodejs 实现的，就放弃了尝试的念头。开玩笑，jedi 这么一大坨 Python 就慢成这样，nodejs 岂不是更糟糕吗。没想到 coc 一直流行到现在，这似乎再次证明了一个论点，即易用和功能全面才是软件流行的第一因素，无论它的实现有多么不优雅、效率有多么低，只要是能用的、可接受的就行，用户在使用体验上得到满足后，对于小问题的容忍度是相当高的。

P.S. 从当年的笔记中找到了所参考的项目和文章：

- https://www.reddit.com/r/neovim/comments/8ejfg0/state_of_lsp_servers/
- https://github.com/autozimu/LanguageClient-neovim
- https://github.com/prabirshrestha/vim-lsp
- https://github.com/ncm2/ncm2
- https://github.com/palantir/python-language-server

[^1]: https://github.com/Shougo/deoplete.nvim/wiki/Completion-Sources

## 2021

2021 年的某一天，因为 ncm2 长期存在的一个小问题（现在已经忘了），我一气之下再次打开了 deoplete 的项目页面，惊喜地发现它已经完善了对 LSP 的支持，于是立刻就开始迁移，换回了我更欣赏且代码品质更胜一筹的 deoplete。

Commit: [cd044fcda603ad5b9ee16bd4d7d7873c9ade9a31](https://github.com/reorx/dotfiles/commit/cd044fcda603ad5b9ee16bd4d7d7873c9ade9a31)
> **nvim: rework on languageserver & python completion**
>
> *committed on Mar 26, 2021*

```diff
-Plug 'ervandew/supertab'
-Plug 'ncm2/ncm2'
-Plug 'roxma/nvim-yarp'
-Plug 'autozimu/LanguageClient-neovim', { 'branch': 'next', 'do': 'bash install.sh',
+Plug 'Shougo/deoplete.nvim', { 'do': ':UpdateRemotePlugins' }
+Plug 'prabirshrestha/vim-lsp'
+Plug 'mattn/vim-lsp-settings'
+Plug 'lighttiger2505/deoplete-vim-lsp'
```

这次变更除了换回 deoplete ，还去掉了陪伴多年的 supertab，在抄了一段看不懂的配置后，实现了我更为习惯的 tab 键触发补全的方式。
## 2022

在咖啡馆结束了一天的主要工作后，看着好友 [@iwendellsun](https://github.com/xwjdsh) 流畅的 vim 操作，我问起了它的 nvim 自动补全配置，果然有许多我从未听过的东西。于是趁此机会赶紧向他请教，在他的指导下完成了 2022 年的配置升级。

Commit: [3de43d030ca40b498911c6752a7396af38202fe6](https://github.com/reorx/dotfiles/commit/3de43d030ca40b498911c6752a7396af38202fe6)
> **nvim: use nvim-cmp for completion**
>
> *committed on May 08, 2022*

```diff
-Plug 'Shougo/deoplete.nvim', { 'do': ':UpdateRemotePlugins' }
-Plug 'prabirshrestha/vim-lsp'
-Plug 'mattn/vim-lsp-settings'
-Plug 'lighttiger2505/deoplete-vim-lsp'
-Plug 'w0rp/ale'
-Plug 'rhysd/vim-lsp-ale'
+Plug 'williamboman/nvim-lsp-installer'
+Plug 'neovim/nvim-lspconfig'
+Plug 'hrsh7th/cmp-nvim-lsp'
+Plug 'hrsh7th/cmp-buffer'
+Plug 'hrsh7th/cmp-path'
+Plug 'hrsh7th/cmp-cmdline'
+Plug 'hrsh7th/nvim-cmp'
```

这次变更分以下几个方面：

1. 补全框架从 deoplete 变为 [nvim-cmp](https://github.com/hrsh7th/nvim-cmp)，我还没细看，不过据说它就是现在的 meta & state of the art.
2. LSP 集成从 vim-lsp 换成了 nvim-lspconfig。迟来的官方出品。
3. 去掉了 ale 和 vim-lsp-ale。nvim-cmp 可以将 LSP client 返回的错误提示直接在行内显示，不需要再依赖 ALE 这个 linter 框架了。
4. Last but not least, 这些插件的配置语法几乎都是用 Lua 写的，这让用了 10 年 Vimscript 的我感到极度陌生和恐慌。

相比之前的变更，这是唯一一次生搬硬套而非全部理解的，我主要是想快速上车，免得被社区发展抛在了后面，现在实在没有太多精力可以悠闲地慢慢尝试。虽然有人指导免去了初次上手的痛苦，但可以预见的是，想要让这套插件和我的编程习惯完美契合，还有许多坑等着我去折腾呢。

**参考链接**:
- [Setup | nvim-cmp](https://github.com/hrsh7th/nvim-cmp#setup)
    - [List of sources · hrsh7th/nvim-cmp Wiki](https://github.com/hrsh7th/nvim-cmp/wiki/List-of-sources)
    - [Example mappings · hrsh7th/nvim-cmp Wiki](https://github.com/hrsh7th/nvim-cmp/wiki/Example-mappings)
- [Default configuration | nvim-lsp-installer](https://github.com/williamboman/nvim-lsp-installer#default-configuration)
- [Server Configurations | nvim-lspconfig](https://github.com/neovim/nvim-lspconfig/blob/master/doc/server_configurations.md)
    - [pylsp](https://github.com/neovim/nvim-lspconfig/blob/master/doc/server_configurations.md#pylsp)
    - [pyright](https://github.com/neovim/nvim-lspconfig/blob/master/doc/server_configurations.md#pyright)
    - [gopls](https://github.com/neovim/nvim-lspconfig/blob/master/doc/server_configurations.md#gopls)
- [ray-x/lsp_signature.nvim: LSP signature hint as you type](https://github.com/ray-x/lsp_signature.nvim)

**参考配置**:
- https://github.com/xwjdsh/dotfiles/blob/master/nvim1/lua/plugins.lua
- https://github.com/Avimitin/nvim/blob/master/lua/plugins/load.lua

## 结语

Vim 的 LSP 插件生态还有许多有待优化的空间，开发者们对生产力的追求是永无止境的，下一个 5 年编辑器的体验会有着怎样激动人心的变化，我对此充满期待。