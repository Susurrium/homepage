import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const title = z.string().trim().min(1, '标题不能为空').max(80, '标题请控制在 80 个字符以内');
const description = z
  .string()
  .trim()
  .min(10, '描述至少需要 10 个字符')
  .max(180, '描述请控制在 180 个字符以内');

const tag = z
  .string()
  .trim()
  .transform((value) => value.normalize('NFKC').replace(/\s+/g, ' '))
  .pipe(
    z
      .string()
      .min(1, '标签不能为空')
      .max(40, '单个标签请控制在 40 个字符以内')
      .refine((value) => !/[\\/]/.test(value), '标签不能包含路径分隔符')
      .refine((value) => !/^\.+$/.test(value), '标签不能只由句点组成')
      .refine(
        (value) => !/^(?:page|con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(value),
        '标签使用了保留名称'
      )
  );

const tags = z
  .array(tag)
  .max(20, '单篇内容最多设置 20 个标签')
  .default([])
  .transform((values) => {
    const seen = new Set<string>();
    const normalized: string[] = [];

    for (const value of values) {
      // 小写形式只用于单篇文章内判重，页面仍显示作者最先填写的形式。
      const display = value;
      const key = display.toLocaleLowerCase('en-US');
      if (seen.has(key)) continue;

      seen.add(key);
      normalized.push(display);
    }

    return normalized;
  });

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z
      .object({
        title,
        description,
        date: z.coerce.date(),
        updated: z.coerce.date().optional(),
        category: z.string().trim().min(1).max(40).default('随笔'),
        tags,
        hero: z
          .object({
            src: image(),
            alt: z.string().trim().min(1, '题图必须提供替代文本').max(160),
            color: z
              .string()
              .regex(/^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i, '题图颜色请使用十六进制格式')
              .optional()
          })
          .optional(),
        draft: z.boolean().default(false),
        featured: z.boolean().default(false)
      })
      .refine((value) => !value.updated || value.updated >= value.date, {
        message: '更新时间不能早于发布日期',
        path: ['updated']
      })
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title,
    description,
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
    title,
    description,
    date: z.coerce.date(),
    venue: z.string(),
    authors: z.array(z.string()).default([]),
    type: z.string().default('论文'),
    link: z.url().optional(),
    tags
  })
});

export const collections = { blog, projects, publications };
