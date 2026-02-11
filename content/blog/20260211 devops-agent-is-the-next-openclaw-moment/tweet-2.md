# Tweet 2: Vocalflow 部署实录 — DevOps 的真实困难

> Source: https://x.com/novoreorx/status/2021035565626568721
> Date: 2026-02-10 | Likes: 13 | Replies: 1
> QT of Tweet 1

碎碎念说一下这次做 Vocalflow (我开发的语音输入 + 转义服务) 部署时，整个操作流程中那些很难让 Agent 完成的事情。

首先，我在自部署的 Dokploy 上创建了一个 project，并在里面创建了我们的 app。接着，我手动点击配置了在 GitHub 上构建的 Docker 镜像路径。由于我们的镜像是私有的，我还得去找 GitHub 的 PAT 并将其复制进去。

再然后，我为项目编写了 GitHub Actions 以实现镜像构建。这是唯一让 OpenClaw 帮我做的事情。随后又写了一个后续的 Action：当镜像构建完成，通过 CURL 调用部署平台的接口，触发自动部署。因为这步需要传 Token 进行验证，所以我又打开 GitHub Actions 的配置页面，增加了 Secret Value。

弄完这些后，我 push 了一次代码，系统开始自动部署，结果发现运行不成功。我检查后发现是 better-sqlite3 找不到 Native Build 的 Node 扩展。让 OpenClaw debug + 搜索了半天：
1. 第一次它尝试将镜像的 Base 从 Alpine 换成 Debian Slim，但没有效果。
2. 多次搜索无果后，我人肉到项目的 Issues 里面搜索 "Alpine"，终于找到了关于 Docker 启动的问题。 https://github.com/WiseLibs/better-sqlite3/issues/146
3. 随后在里面找到一条回复讲 pnpm workspace 的，发现是因为 pnpm 阻碍了 better-sqlite3 包安装后的后续构建，需要添加一个 "approve-builds" 的配置。

告诉 OpenClaw 之后，它添加了文件并再次 push，项目终于运行起来了。

接下来是域名配置。我得先在 Cloudflare 的 Dashboard 上找到我的顶级域名，增加一个二级域名，并将其指向部署平台的服务器。做完这些，我回到 Dokploy 增加新域名到服务的映射，并配置通过 Let's Encrypt 自动开启 HTTPS。这一步还要把端口配置清楚，我找 OpenClaw 问了服务到底运行在哪个端口。这才全部搞定。随后我又去检查 Docker 的运行日志，确认它是否正确执行了 auto-migration。发现不行，又通知 OpenClaw 检查这个问题，但由于它不能直接看线上的日志，难以验收自己的修复是否生效，我又来回调试了好几次。搞定之后，我起了个新的会话，让它调研并写一个获取 dokploy 服务日志的命令行工具，必可活用于下次。 https://github.com/reorx/scripts/blob/master/dokploy-logs

这就是 DevOps 的工作，极度繁琐、琐碎且无规律，没有办法用一套通用的方案去标准化。尤其是在项目初期，熵值非常高。只有当项目足够稳定后，才可能通过 Ansible 或 Terraform 这种标准化的文本方式去管理，形成 SOP。

在当下开发节奏如此之快的时代，每个人都在不断构建新项目，基于现有数据训练出的通用 Coding LLM 虽然拥有 DevOps 的知识，但还不能真正胜任相应工作，无法如对待开发工作那样实现完整闭环。这是现实，也是我认为未来 Agent 需要去探索的一个方向。
