import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
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
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    role: z.string(),
    status: z.enum(['进行中', '已完成', '维护中']).default('已完成'),
    stack: z.array(z.string()).default([]),
    demo: z.string().url().optional(),
    repo: z.string().url().optional(),
    cover: z.string().optional(),
    featured: z.boolean().default(false)
  })
});

const publications = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    venue: z.string(),
    authors: z.array(z.string()).default([]),
    type: z.string().default('论文'),
    link: z.string().url().optional(),
    tags: z.array(z.string()).default([])
  })
});

export const collections = { blog, projects, publications };
