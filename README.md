# Personal Homepage

一个基于 Astro、Tailwind CSS、Markdown 内容集合和 Pagefind 的个人主页及个人博客。

## 功能

- 首页、博客、项目、成果、关于、友链、搜索
- Markdown 内容管理
- 深色模式
- RSS 与 Sitemap
- Pagefind 静态全文搜索
- 适合 Cloudflare Pages 或 GitHub Pages 部署

## 本地运行

```sh
npm install
npm run dev
```

## 构建和预览

```sh
npm run build
npm run preview
```

`npm run build` 会先执行 `astro build`，再用 Pagefind 为 `dist` 生成搜索索引。

## 修改个人信息

优先修改：

```text
src/data/site.ts
```

文章放在：

```text
src/content/blog
```

项目放在：

```text
src/content/projects
```

成果放在：

```text
src/content/publications
```

部署前请把 `astro.config.mjs` 里的 `site` 改成你的真实域名。
