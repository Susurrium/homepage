import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    category: z.string().default('随笔'),
    tags: z.array(z.string()).default([]),
    hero: z.string().optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false)
  })
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    role: z.string(),
    status: z.enum(['进行中', '已完成', '维护中']).default('已完成'),
    stack: z.array(z.string()).default([]),
    demo: z.url().optional(),
    repo: z.url().optional(),
    cover: z.string().optional(),
    featured: z.boolean().default(false)
  })
});

const publications = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/publications' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    venue: z.string(),
    authors: z.array(z.string()).default([]),
    type: z.string().default('论文'),
    link: z.url().optional(),
    tags: z.array(z.string()).default([])
  })
});

export const collections = { blog, projects, publications };
