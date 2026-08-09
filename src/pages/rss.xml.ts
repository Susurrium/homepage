import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '../data/site';
import { published, sortByDate } from '../lib/content';
import { withBase } from '../lib/url';

export async function GET(context: { site?: URL }) {
  const posts = sortByDate(published(await getCollection('blog')));
  const origin = context.site ?? new URL(site.url);
  const siteUrl = new URL(withBase('/'), origin);

  return rss({
    title: site.title,
    description: site.description,
    site: siteUrl,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: new URL(withBase(`/blog/${post.id}/`), origin).toString()
    })),
    customData: '<language>zh-CN</language>'
  });
}
