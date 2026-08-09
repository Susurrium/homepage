---
title: "个人主页与博客系统"
description: "使用 Astro、Tailwind CSS、Markdown 和 Pagefind 构建的静态个人站点。"
date: 2026-05-11
role: "设计与开发"
status: "维护中"
stack: ["Astro", "TypeScript", "Tailwind CSS", "Pagefind"]
demo: "https://susurrium.github.io/homepage/"
repo: "https://github.com/Susurrium/homepage"
cover: "/images/project-homepage.svg"
featured: true
---

这个项目用于集中展示个人介绍、博客文章、项目作品和公开成果。

## 功能

- Markdown 内容管理
- 深色模式
- 全文搜索
- RSS 订阅
- 项目与成果页面
- 响应式布局

## 维护方式

个人信息放在 `src/data/site.ts`，文章放在 `src/content/blog`。新增内容只需要复制一个 Markdown 文件并修改 frontmatter。
