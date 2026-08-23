# Personal Homepage

Susurrium 的静态个人主页与博客，基于 Astro、Tailwind CSS、Markdown 内容集合和 Pagefind 构建。

## 功能

- 首页、博客、项目、成果、关于、友链、归档、标签和搜索
- Markdown / MDX 内容管理，支持数学公式、GitHub 风格提示块与双主题代码高亮
- 文章阅读进度、响应式目录、标题/代码复制和图片灯箱
- 博客与标签分页、按年份归档
- 深色模式与移动端键盘/焦点支持
- Pagefind Component UI 静态全文搜索
- 全文 RSS、Sitemap、Open Graph、Article JSON-LD、Web App Manifest 和自定义 404
- 动态签名与减少动态效果支持
- GitHub Pages 自动部署与桌面/移动端浏览器测试

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
npx playwright install chromium
npm test
```

该命令依次执行 Astro 类型检查、生产构建、路由/RSS/Pagefind 冒烟验证，以及桌面 Chrome 和 Pixel 7 视口下的 Playwright 端到端与无障碍检查。也可以分别运行：

```sh
npm run test:static
npm run test:e2e
```

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

博客 frontmatter 支持 `updated`、`category`、`tags`、`draft`、`featured`，以及带 `src`、`alt`、可选 `color` 的 `hero` 对象。日期建议统一写成 `YYYY-MM-DD`；标签应保持稳定大小写，且不能使用路径分隔符或 `page` 等保留名称。标题、描述、标签和题图替代文本会在构建时校验；正式内容缺失或格式错误时构建会直接失败，避免带病发布。

实验用的签名候选素材已移到 `archive/signature-lab/`，不会进入生产构建；站点继续使用 `public/images/signature-ink.png`。

## 部署配置

默认目标为 GitHub Pages 项目站点 `https://susurrium.github.io/homepage/`。部署到其他地址时设置：

```text
SITE_URL=https://example.org
BASE_PATH=/
```

`SITE_URL` 是站点来源地址，`BASE_PATH` 是部署子路径。站内导航、图片、RSS、Sitemap 和 Open Graph 地址都会跟随该配置。

后续发布确认与决策型功能见 [项目路线图](./ROADMAP.md)。
