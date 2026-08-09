---
title: "用 Astro 搭建个人主页的第一天"
description: "记录本站的技术选型、目录结构和后续维护方式。"
date: 2026-05-11
category: "建站"
tags: ["Astro", "个人博客", "Markdown"]
featured: true
---

这个站点采用 Astro、Tailwind CSS 和 Markdown 内容集合搭建。它的目标不是做一个复杂后台，而是把个人介绍、文章、项目和成果都放在一个可以长期维护的静态站里。

## 为什么选择 Astro

Astro 的优势在于默认输出静态页面，加载快，部署简单。对于个人主页和博客来说，大多数内容不需要后端数据库，Markdown 文件已经足够稳定。

## 当前目录

核心目录如下：

```text
src/content/blog          博客文章
src/content/projects      项目介绍
src/content/publications  成果列表
src/data/site.ts          个人信息和站点配置
src/pages                 页面路由
```

## 后续计划

评论、访问统计、图片优化和多语言等工程计划统一维护在仓库的 [ROADMAP](https://github.com/Susurrium/homepage/blob/master/ROADMAP.md) 中。更重要的是保持内容更新，把每一次项目复盘和学习记录沉淀下来。
