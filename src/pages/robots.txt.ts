import { site } from '../data/site';
import { withBase } from '../lib/url';

export function GET({ site: astroSite }: { site?: URL }) {
  const origin = astroSite ?? new URL(site.url);
  const base = new URL(withBase('/'), origin).toString().replace(/\/$/, '');

  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap-index.xml\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
}
