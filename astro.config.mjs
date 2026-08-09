// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

const site = process.env.SITE_URL ?? 'https://susurrium.github.io';
const base = process.env.BASE_PATH ?? '/homepage';

// https://astro.build/config
export default defineConfig({
  site,
  base,
  integrations: [sitemap({ filter: (page) => !page.endsWith('/signature-lab/') })],
  vite: {
    plugins: [tailwindcss()]
  }
});
