import { site } from '../data/site';

export function GET({ site: astroSite }: { site?: URL }) {
  const base = astroSite?.toString().replace(/\/$/, '') ?? site.url;

  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap-index.xml\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
}
