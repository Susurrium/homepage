import type { CollectionEntry } from 'astro:content';

type DatedEntry = {
  data: {
    date: Date;
    draft?: boolean;
    tags?: string[];
  };
};

export const BLOG_PAGE_SIZE = 8;

export interface PaginatedItems<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface YearGroup<T> {
  year: number;
  posts: T[];
}

export function published<T extends DatedEntry>(entries: readonly T[]) {
  return entries.filter((entry) => !entry.data.draft);
}

export function sortByDate<T extends DatedEntry>(entries: readonly T[]) {
  return [...entries].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function pageCount(totalItems: number, pageSize = BLOG_PAGE_SIZE) {
  if (!Number.isInteger(pageSize) || pageSize < 1) {
    throw new RangeError('pageSize must be a positive integer');
  }

  return Math.max(1, Math.ceil(totalItems / pageSize));
}

export function paginate<T>(
  entries: readonly T[],
  currentPage: number,
  pageSize = BLOG_PAGE_SIZE
): PaginatedItems<T> {
  const totalPages = pageCount(entries.length, pageSize);

  if (!Number.isInteger(currentPage) || currentPage < 1 || currentPage > totalPages) {
    throw new RangeError(`currentPage must be between 1 and ${totalPages}`);
  }

  const start = (currentPage - 1) * pageSize;

  return {
    items: entries.slice(start, start + pageSize),
    currentPage,
    totalPages,
    totalItems: entries.length
  };
}

export function groupByYear<T extends DatedEntry>(entries: readonly T[]): YearGroup<T>[] {
  const groups = new Map<number, T[]>();

  for (const entry of sortByDate(entries)) {
    const year = entry.data.date.getFullYear();
    const posts = groups.get(year) ?? [];
    posts.push(entry);
    groups.set(year, posts);
  }

  return [...groups.entries()].map(([year, posts]) => ({ year, posts }));
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

export function tagSlug(tag: string) {
  return tag.normalize('NFKC').trim().toLocaleLowerCase('en-US');
}

export function tagPathSegment(tag: string) {
  return encodeURIComponent(tagSlug(tag));
}

export function allTags(posts: readonly CollectionEntry<'blog'>[]) {
  const tags = new Map<string, { name: string; count: number }>();

  for (const post of posts) {
    for (const tag of post.data.tags ?? []) {
      const key = tagSlug(tag);
      const existing = tags.get(key);
      if (existing) existing.count += 1;
      else tags.set(key, { name: tag, count: 1 });
    }
  }

  return [...tags.values()]
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh-CN'));
}
