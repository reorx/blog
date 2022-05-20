---
title: 搭建 umami 收集个人网站统计数据
slug: deploy-umami-for-personal-website
date: 2022-05-19
description: 教你如何免费搭建和使用美丽的 umami 网站统计服务，和 Google Analytics 说再见。
tags:
  - webmaster
ShowToc: true
writingTime: 01:42
cover:
  image: images/umami-chart.png
socialLinks:
  twitter:
    user: novoreorx
    id: 1527333854759256065
---

距离博客第一篇文章发布正好一个月，我想查看一下网站的统计数据，在 Google Analytics 上操作了一番，发觉自己已无法忍受这个复杂且迟缓的老旧产品，这让我开始思考有没有更好的解决方案。

我首先想到的是切换到另一家 hosting 的网站统计服务，如果可以的话，最好能有免费额度。然而开公司并不是做慈善，Google 之所以开放 Analytics 免费使用，除了本身体量足够大、边际成本够低之外，也因为网站统计与其核心的广告业务是密不可分的，Google 乐于让尽可能多的网站使用 Analytics，以得到可以推动广告和搜索业务发展的数据。果不其然，目前风评比较好的服务如 [fathom](https://usefathom.com/pricing) 都没有免费套餐，价格也不便宜；[plausible](https://plausible.io/#pricing) 价格较低，并且提供开源可部署的版本，这让我开始考虑自建统计服务的可行性。

要选择一个 self-hosted 网站统计服务，我有以下几个考量：
- **实现语言**：我非常倾向于 JavaScript 的实现，这并非出于我对它更加熟悉或者偏爱，而是因为近年来 Cloudflare 在 serverless 和 edge computing 领域不断深耕，推动了一系列基于 JavaScript 的运行环境和基础设施的发展，最近还联合 Vercel 等友商成立了 [WinterCG](https://blog.cloudflare.com/introducing-the-wintercg/) 社区组织，让我看到了 JavaScript 一站式云端开发部署的未来。我自己也尝试过 Workers 开发，体验很好，免费额度充裕。如果一个服务是 JavaScript 实现，就有在 Workers 上部署的可能性。
- **数据库**：最好是 SQLite。SQLite 的存储基于单文件，非常适合小型服务的开发部署。[Litestream](https://litestream.io/) 的存在让基于 S3 等对象存储的低成本数据库维护成为可能。
- **便于部署**：有官方维护的 docker image，或提供 PaaS/Serverless 平台的一键部署模板
- **尊重数据隐私**：其实 self-hosted 统计服务产生的目的之一就是为了抵制商业服务滥用用户数据，因此这一点大部分项目都可以满足，稍加注意即可。
- **ublock**：作为一个 webmaster，肯定希望统计数据越精确越好，因此这个服务得有绕过 ublock 拦截的能力。虽然我个人也会使用 ublock 拦截各种 tracker，但 self-hosted 统计服务本身不会过度收集用户数据，更不会将其用于商业目的，可以理直气壮地想办法确保其正常加载。

经过一番调查，我选择了 umami，它基本满足以上所有需求：
- 前后端全部使用 TypeScript 和 Next.js 开发
- 数据库是 PostgreSQL，我比较喜欢，可以接受
- 项目页面有个大大的 “Deploy on Railway”，也有 docker image
- 项目 Slogan 就是 “privacy focused”
    > Umami does not collect any personally identifiable information and anonymizes all data collected.
- 提供 `TRACKER_SCRIPT_NAME` 环境变量用于自定义 script 名称，可以绕过 ublock 的默认规则

择日不如撞日，选定工具后我立刻开始尝试部署。umami 的部署流程是如此顺滑，只花了大概 15 分钟，我就确信自己做了一个十分正确的选择。

## 部署说明

我之前就对 Railway 有所了解，所以直接点击 “Deploy on Railway” 按钮开始部署流程。

[Railway](https://railway.app) 是一个 PaaS 平台，可运行 JavaScript, Python, Go 等多种语言，提供 Redis, MySQL, MongoDB 等主流数据库存储。由于支持全面、界面友好，加上和 Cloudflare 一样有充裕的[免费额度](https://railway.app/pricing)，足够个人项目免费使用，Railway 一直是我心中最好的 PaaS 之一。如果你有兴趣，欢迎通过我的 [referral link](https://railway.app?referralCode=XkWaVV) 注册。

umani 有一篇 [Running on Railway](https://umami.is/docs/running-on-railway) 文档，我遵照这个流程很快就完成了初步部署。其实只有一个 `HASH_SALT` 需要输入，其他只需点点点即可。

Railway Project 创建后，在管理界面可以看到两个 block，左边是数据库实例，右边是 umami 的后端服务。

![](./images/railway.png)

### 安装依赖

在等待 umami 的镜像构建和部署的过程中，我们可以在命令行进行一些其他工作。

打开命令行，使用以下命令安装 Railway CLI 和 pgsql 两个软件依赖。

```bash
brew install railwayapp/railway/railway
brew install libpg
```

完成后，将 libpg 的 bin 路径添加到 PATH 中，在 `.zshrc` 或 `.bashrc` 中添加一行:

```bash
export PATH="$PATH:/opt/homebrew/opt/libpq/bin"
```

你可以通过执行 `type pgsql` 确认 `pgsql` 是否存在。

### 更新数据库

Railway 在创建 Project 时，会将 umami 的代码复制到在你的 GitHub 账户所创建的名为 `umami` 的仓库中，我们需要先将此仓库 clone 下来:

```bash
git clone git@github.com:username/umami.git
```

进入 umami 目录，执行以下命令，登录 Railway CLI 并完成链接:

```bash
cd umami
railway login
railway link
```

这一步完成后，可以通过 `railway variables` 看到 umami 服务的环境变量，确认 CLI 可以访问到线上数据。

```
DATABASE_URL:        postgresql://postgres:xxxxxxxxx@containers-us-west.railway.app:6595/railway
DISABLE_TELEMETRY:   1
HASH_SALT:           xxXXxxXXxxXXxx
HOSTNAME:
PGDATABASE:          railway
PGHOST:              containers-us-west.railway.app
PGPASSWORD:          xxXXxxXXxxXXxx
PGPORT:              6595
PGUSER:              postgres
PORT:                3000
```

执行以下命令，为 umami 创建表格、添加初始数据。注意要将 bash variable 替换为上文中的数据:

```bash
railway run psql -h $PGHOST -U $PGUSER -d $PGDATABASE -f sql/schema.postgresql.sql
```

### 配置服务

数据库初始化完毕后，回到 Project 管理界面，确认 umami 部署完毕，即可打开服务的主页。

#### 更换密码

使用初始用户名密码 `admin:umami` 登录进去，然后立刻到 Settings > Accounts 界面更换一个强密码。

#### 绑定个人域名

在 Project 管理界面点击 umami，选择 Settings，在 Service Domains 下添加个人域名。比如我使用的是 `oishii.reorx.com`。

![](./images/railway-1.png)

打开域名的 DNS 服务商，根据 Railway 中的提示，为自定义域名添加 CNAME 记录。

![](./images/cloudflare.png)

等待几分钟，生效后 Railway 中会显示上图所示的 ✅ 符号。

#### 修改脚本名称

为了避免 umami 被 ublock 误杀（有的规则集中有匹配 umami 的正则），还需要为它的统计脚本更换一个名称。[Environment variables](https://umami.is/docs/environment-variables) 文档中的 `TRACKER_SCRIPT_NAME` 提供了这一功能。

再次进入 Railway，打开 umami 的 Variables 选项卡，按下图所示添加环境变量，我使用的名称为 `oishii`，可以更换为任意非 tracker 特征词汇。

![](./images/railway-2.png)

完成这一步后，需要重新构建 umami 的镜像，目前我还没有找到触发 rebuild 的简单方法，只能通过修改 Dockerfile 实现:

```diff
RUN yarn next telemetry disable
+# Ensures `yarn build` will always run when BUILD_TIME is different
+ARG BUILD_TIME
RUN yarn build
```

在 `yarn build` 之前增加一行 `ARG BUILD_TIME`，这样当此参数不同时，就会触发 `yarn build` 及之后的命令重新执行。

保存修改，然后执行 `railway up`，等待镜像构建和部署完成。

## 接入个人网站

一切准备就绪，我们重新使用自定义域名和修改后的密码登录 umami。

要进行统计，第一件事情是添加一个 Website。操作非常简单，读者可以参考 [Add a website](https://umami.is/docs/add-a-website) 文档来进行。唯一需要注意的是 Enable share URL 选项，如果你想将自己网站的统计数据分享出去，则需要勾选之。你可以在 https://oishii.reorx.com/share/jKljpE4T/reorx.com 访问本站的统计信息。

添加完成后，点击网站列表中对应网站的 Get tracking code 按钮，在浮窗中获得需要加入到网站 HTML 中的代码。

![](./images/umami.png)

需要注意将 `src` 结尾的 `umami.js` 替换为 `$TRACKER_SCRIPT_NAME.js`。

复制代码并添加到自己个人网站的 `<head>` 标签下的任意位置，由于使用了 `defer` 属性，这个 script 不会对网页加载造成阻塞。

网站更新完成后，呼朋唤友点击访问一番，就可以看到 umami 清晰、美观的统计数据了。

![](./images/umami-1.png)