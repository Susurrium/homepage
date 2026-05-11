import type { CollectionEntry } from 'astro:content';

type DatedEntry = {
  data: {
    date: Date;
    draft?: boolean;
    tags?: string[];
  };
};

export function published<T extends DatedEntry>(entries: T[]) {
  return entries.filter((entry) => !entry.data.draft);
}

export function sortByDate<T extends DatedEntry>(entries: T[]) {
  return [...entries].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export function readingTime(body = '') {
  const cnChars = body.match(/[\u4e00-\u9fa5]/g)?.length ?? 0;
  const words = body.replace(/[\u4e00-\u9fa5]/g, '').trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil((cnChars / 450 + words / 220) || 1));
  return `${minutes} 分钟`;
}

export function allTags(posts: CollectionEntry<'blog'>[]) {
  const tags = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.data.tags ?? []) {
      tags.set(tag, (tags.get(tag) ?? 0) + 1);
    }
  }

  return [...tags.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh-CN'));
}
