---
title: "DevOps Agent Is the Next OpenClaw Moment"
slug: devops-agent-is-the-next-openclaw-moment
date: 2026-02-11T12:00:00+08:00
draft: true
tags:
  - AI
  - OpenClaw
  - DevOps
ShowToc: false
---

前两天分享了 OpenClaw 对我的帮助，它能够真正地代替我站在程序员这个角色上，让我能从繁琐的开发任务中抽身，站在项目决策、产品设计和公司未来发展的层面去思考。我终于可以像一个"一人公司"的 CEO 那样，去做更多管理者该做的事情，这对我来说是巨大的提升。

但是，今天有一个项目要上线时，我意识到它还是不能代替我去做 DevOps 的事情：

1. **复杂度极高**：DevOps 的工作远比程序员复杂，不仅要操作命令行、登录服务器检查，还要求极其严谨的态度，因为一旦出错影响巨大。

2. **多维交互**：需要打开各种网页操作云端资源，拷贝、粘贴各种关键 Key，部署服务，操作云平台的 Web UI。

3. **跨环境切换**：需要来回在命令行与 UI 之间切换，不断验证并处理各种 Edge Case。这些操作已经超出了纯文本表达的范畴。

虽然 OpenClaw 已经可以代替程序员，但目前还没有哪个 Agent 能真正胜任 DevOps，我觉得这里孕育着一个很大的商机。或许现在是时候去做一个真正的、可以独立完成工作的 DevOps Agent 了。

## 一次真实的部署经历

为了让大家理解 DevOps 工作的真实困难，我来分享一下最近部署 Vocalflow（我开发的语音输入 + 转写服务）时的完整经历。

首先，我在自部署的 Dokploy 上创建了一个 project，并在里面创建了我们的 app。接着，我手动点击配置了在 GitHub 上构建的 Docker 镜像路径。由于我们的镜像是私有的，我还得去找 GitHub 的 PAT 并将其复制进去。

再然后，我为项目编写了 GitHub Actions 以实现镜像构建。这是唯一让 OpenClaw 帮我做的事情。随后又写了一个后续的 Action：当镜像构建完成，通过 CURL 调用部署平台的接口，触发自动部署。因为这步需要传 Token 进行验证，所以我又打开 GitHub Actions 的配置页面，增加了 Secret Value。

弄完这些后，我 push 了一次代码，系统开始自动部署，结果发现运行不成功。我检查后发现是 better-sqlite3 找不到 Native Build 的 Node 扩展。让 OpenClaw debug + 搜索了半天：
1. 第一次它尝试将镜像的 Base 从 Alpine 换成 Debian Slim，但没有效果。
2. 多次搜索无果后，我人肉到项目的 Issues 里面搜索 "Alpine"，终于找到了关于 Docker 启动的问题。 https://github.com/WiseLibs/better-sqlite3/issues/146
3. 随后在里面找到一条回复讲 pnpm workspace 的，发现是因为 pnpm 阻碍了 better-sqlite3 包安装后的后续构建，需要添加一个 "approve-builds" 的配置。

告诉 OpenClaw 之后，它添加了文件并再次 push，项目终于运行起来了。

接下来是域名配置。我得先在 Cloudflare 的 Dashboard 上找到我的顶级域名，增加一个二级域名，并将其指向部署平台的服务器。做完这些，我回到 Dokploy 增加新域名到服务的映射，并配置通过 Let's Encrypt 自动开启 HTTPS。这一步还要把端口配置清楚，我找 OpenClaw 问了服务到底运行在哪个端口。这才全部搞定。随后我又去检查 Docker 的运行日志，确认它是否正确执行了 auto-migration。发现不行，又通知 OpenClaw 检查这个问题，但由于它不能直接看线上的日志，难以验收自己的修复是否生效，我又来回调试了好几次。搞定之后，我起了个新的会话，让它调研并写一个获取 dokploy 服务日志的命令行工具，必可活用于下次。 https://github.com/reorx/scripts/blob/master/dokploy-logs

## DevOps Agent 的未来

这就是 DevOps 的工作，极度繁琐、琐碎且无规律，没有办法用一套通用的方案去标准化。尤其是在项目初期，熵值非常高。只有当项目足够稳定后，才可能通过 Ansible 或 Terraform 这种标准化的文本方式去管理，形成 SOP。

在当下开发节奏如此之快的时代，每个人都在不断构建新项目，基于现有数据训练出的通用 Coding LLM 虽然拥有 DevOps 的知识，但还不能真正胜任相应工作，无法如对待开发工作那样实现完整闭环。这是现实，也是我认为未来 Agent 需要去探索的一个方向。

它的核心理念是：

- **不做 DevOps 平台**：不试图再造一个 IaaS 或运维平台。
- **适应现实世界**：我们要做的 Agent 能适应现实世界中的 DevOps 工作流，学习并掌握各种技能（比如操作 AWS、Dokploy 或 Cloudflare 等基础设施）。
- **可插拔的架构**：这个 Agent 应该是"可插拔"的，就像一个人可以去任何公司的任何岗位一样。他可以安装在任何一套系统里，无论是 OpenClaw、Claude Code 还是 Cursor。

这将补完最后一步，使得开发者和小公司能从 DevOps 的琐事中解放出来，让整个想法→开发→上线流程实现彻底闭环。
