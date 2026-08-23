// @ts-check
import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeKatex from 'rehype-katex';
import { remarkAlert } from 'remark-github-blockquote-alert';
import remarkMath from 'remark-math';

import tailwindcss from '@tailwindcss/vite';

const site = process.env.SITE_URL ?? 'https://susurrium.github.io';
const base = process.env.BASE_PATH ?? '/homepage';
const markdownProcessor = unified({
  remarkPlugins: [remarkMath, remarkAlert],
  rehypePlugins: [[rehypeKatex, { strict: false }]]
});

// https://astro.build/config
export default defineConfig({
  site,
  base,
  integrations: [mdx(), sitemap()],
  markdown: {
    processor: markdownProcessor,
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark'
      },
      defaultColor: false
    }
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
