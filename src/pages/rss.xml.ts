import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '../data/site';
import { published, sortByDate } from '../lib/content';

export async function GET(context: { site?: URL }) {
  const posts = sortByDate(published(await getCollection('blog')));

  return rss({
    title: site.title,
    description: site.description,
    site: context.site ?? new URL(site.url),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`
    })),
    customData: '<language>zh-CN</language>'
  });
}
