# Personal Homepage

Susurrium 的静态个人主页与博客，基于 Astro、Tailwind CSS、Markdown 内容集合和 Pagefind 构建。

## 功能

- 首页、博客、项目、成果、关于、友链、搜索
- Markdown 内容管理
- 深色模式
- RSS 与 Sitemap
- Pagefind 静态全文搜索
- 动态签名与减少动态效果支持
- GitHub Pages 自动部署

## 本地运行

需要 Node.js 22.12 或更高版本。

```sh
npm ci
npm run dev
```

## 构建和预览

```sh
npm run build
npm run verify:build
npm run preview
```

`npm run build` 会先执行 `astro build`，再用 Pagefind 为 `dist` 生成搜索索引。

提交前可运行完整质量检查：

```sh
npm test
```

该命令依次执行 Astro 类型检查、生产构建和路由/RSS/Pagefind 冒烟验证。

## 内容与站点信息

站点信息集中在：

```text
src/data/site.ts
```

内容目录：

```text
src/content/blog          博客文章
src/content/projects      项目介绍
src/content/publications  公开成果
```

## 部署配置

默认目标为 GitHub Pages 项目站点 `https://susurrium.github.io/homepage/`。部署到其他地址时设置：

```text
SITE_URL=https://example.org
BASE_PATH=/
```

`SITE_URL` 是站点来源地址，`BASE_PATH` 是部署子路径。站内导航、图片、RSS、Sitemap 和 Open Graph 地址都会跟随该配置。

后续发布确认与决策型功能见 [项目路线图](./ROADMAP.md)。
