import rss, { type RSSFeedItem } from '@astrojs/rss';
import { getImage } from 'astro:assets';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { getCollection, render } from 'astro:content';
import { site } from '../data/site';
import { published, sortByDate } from '../lib/content';
import { withBase } from '../lib/url';

const configuredBase = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function decodeHtmlAttribute(value: string) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}

function absoluteUrl(value: string, pageUrl: URL) {
  if (/^(?:javascript|vbscript):/i.test(value)) return '#';
  if (/^[a-z][a-z\d+.-]*:/i.test(value)) return value;
  if (value.startsWith('//')) return `${pageUrl.protocol}${value}`;

  if (value.startsWith('/')) {
    const internalPath = value.startsWith(configuredBase) ? value : withBase(value);
    return new URL(internalPath, pageUrl).toString();
  }

  return new URL(value, pageUrl).toString();
}

function absolutizeContentUrls(html: string, pageUrl: URL) {
  return html.replace(/\b(href|src)=(['"])(.*?)\2/gi, (match, attribute, quote, value) => {
    if (!value) return match;

    const decodedValue = decodeHtmlAttribute(value);
    return `${attribute}=${quote}${escapeHtml(absoluteUrl(decodedValue, pageUrl))}${quote}`;
  });
}

export async function GET(context: { site?: URL }) {
  const posts = sortByDate(published(await getCollection('blog')));
  const origin = context.site ?? new URL(site.url);
  const siteUrl = new URL(withBase('/'), origin);
  const feedUrl = new URL(withBase('/rss.xml'), origin);
  const container = await AstroContainer.create();
  const items: RSSFeedItem[] = [];

  for (const post of posts) {
    const postUrl = new URL(withBase(`/blog/${post.id}/`), origin);
    const { Content } = await render(post);
    const renderedBody = await container.renderToString(Content, {
      partial: true,
      request: new Request(postUrl)
    });
    const body = absolutizeContentUrls(renderedBody, postUrl);
    const hero = post.data.hero;
    let heroMarkup = '';

    if (hero) {
      const optimizedHero = await getImage({ src: hero.src });
      const heroUrl = absoluteUrl(optimizedHero.src, postUrl);
      const color = hero.color ? ` style="background-color:${escapeHtml(hero.color)}"` : '';

      heroMarkup =
        `<figure${color}>` +
        `<img src="${escapeHtml(heroUrl)}" alt="${escapeHtml(hero.alt)}" ` +
        `width="${hero.src.width}" height="${hero.src.height}" loading="lazy" decoding="async">` +
        '</figure>';
    }

    items.push({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: postUrl.toString(),
      content: `${heroMarkup}${body}`,
      categories: [...new Set([post.data.category, ...post.data.tags])],
      ...(site.email ? { author: `${site.email} (${site.author})` } : {})
    });
  }

  return rss({
    title: site.title,
    description: site.description,
    site: siteUrl,
    items,
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom'
    },
    customData:
      '<language>zh-CN</language>' +
      `<atom:link href="${escapeHtml(feedUrl.toString())}" rel="self" type="application/rss+xml" />`
  });
}
