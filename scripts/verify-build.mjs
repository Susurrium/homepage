import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(projectRoot, 'dist');
const failures = [];
let passedChecks = 0;

const siteOrigin = process.env.SITE_URL ?? 'https://susurrium.github.io';
const configuredBase = process.env.BASE_PATH ?? '/homepage';
const basePath = `/${configuredBase.replace(/^\/+|\/+$/g, '')}${configuredBase === '/' ? '' : '/'}`;
const siteRoot = new URL(basePath, siteOrigin).toString();

const staticRoutes = [
  '/',
  '/about/',
  '/archives/',
  '/blog/',
  '/links/',
  '/projects/',
  '/publications/',
  '/search/',
  '/tags/'
];

const placeholderMarkers = ['example.com', 'yourname', '你的名字', '某某大学'];

function relativePath(filePath) {
  return path.relative(projectRoot, filePath).split(path.sep).join('/');
}

function routeOutput(route) {
  const segments = route.split('/').filter(Boolean);
  return path.join(distDir, ...segments, 'index.html');
}

async function isNonEmptyFile(filePath) {
  try {
    const fileStat = await stat(filePath);
    return fileStat.isFile() && fileStat.size > 0;
  } catch {
    return false;
  }
}

async function pathExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function requireFile(filePath, description) {
  if (await isNonEmptyFile(filePath)) {
    passedChecks += 1;
    return true;
  }

  failures.push(`${description}: missing or empty ${relativePath(filePath)}`);
  return false;
}

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(entryPath)));
    } else if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
}

async function listContentFiles(collection) {
  const collectionDir = path.join(projectRoot, 'src', 'content', collection);
  const files = (await listFiles(collectionDir)).filter((filePath) => ['.md', '.mdx'].includes(path.extname(filePath)));
  if (collection !== 'blog') return files;

  const publishedFiles = [];
  for (const filePath of files) {
    const source = await readFile(filePath, 'utf8');
    const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1] ?? '';
    if (!/^draft:\s*true\s*$/im.test(frontmatter)) publishedFiles.push(filePath);
  }
  return publishedFiles;
}

async function listDetailOutputs(collection) {
  const collectionDir = path.join(distDir, collection);
  return (await listFiles(collectionDir)).filter(
    (filePath) =>
      path.basename(filePath) === 'index.html' &&
      filePath !== path.join(collectionDir, 'index.html') &&
      !filePath.includes(`${path.sep}page${path.sep}`)
  );
}

function passOrFail(passed, message) {
  if (passed) passedChecks += 1;
  else failures.push(message);
}

async function verifyRoutes() {
  for (const route of staticRoutes) {
    await requireFile(routeOutput(route), `static route ${route}`);
  }

  const collectionOutputs = new Map();
  for (const collection of ['blog', 'projects']) {
    const sourceFiles = await listContentFiles(collection);
    const detailOutputs = await listDetailOutputs(collection);
    collectionOutputs.set(collection, detailOutputs);
    passOrFail(
      sourceFiles.length > 0 && detailOutputs.length === sourceFiles.length,
      `${collection} details: expected ${sourceFiles.length} generated page(s), found ${detailOutputs.length}`
    );
  }

  const tagHrefs = new Set();
  for (const blogOutput of collectionOutputs.get('blog') ?? []) {
    const html = await readFile(blogOutput, 'utf8');
    for (const match of html.matchAll(/href="([^"]+)"/g)) {
      if (match[1].startsWith(`${basePath}tags/`)) tagHrefs.add(match[1]);
    }
  }

  for (const href of tagHrefs) {
    const encodedTag = href.slice(`${basePath}tags/`.length).replace(/\/$/, '');
    const tag = decodeURIComponent(encodedTag);
    await requireFile(routeOutput(`/tags/${tag}/`), `tag detail ${href}`);
  }

  const tagOutputs = await listDetailOutputs('tags');
  passOrFail(
    tagHrefs.size > 0 && tagOutputs.length === tagHrefs.size,
    `tag details: expected ${tagHrefs.size} generated page(s), found ${tagOutputs.length}`
  );

  await requireFile(path.join(distDir, 'robots.txt'), 'robots output');
  await requireFile(path.join(distDir, '404.html'), 'custom 404 output');
  await requireFile(path.join(distDir, 'site.webmanifest'), 'web app manifest');
  await requireFile(path.join(distDir, 'app-icon.svg'), 'web app vector icon');
  await requireFile(path.join(distDir, 'apple-touch-icon.png'), 'Apple touch icon');
  await requireFile(path.join(distDir, 'icon-192.png'), '192px web app icon');
  await requireFile(path.join(distDir, 'icon-512.png'), '512px web app icon');
  await requireFile(path.join(distDir, 'favicon-32.png'), 'PNG favicon');
  await requireFile(path.join(distDir, 'sitemap-index.xml'), 'sitemap index');
  await requireFile(path.join(distDir, 'sitemap-0.xml'), 'sitemap content');
}

async function verifyRss() {
  const rssPath = path.join(distDir, 'rss.xml');
  if (!(await requireFile(rssPath, 'RSS feed'))) return;

  const rss = await readFile(rssPath, 'utf8');
  const itemBlocks = [...rss.matchAll(/<item(?:\s|>)[\s\S]*?<\/item>/gi)].map((match) => match[0]);
  const blogOutputs = await listDetailOutputs('blog');
  passOrFail(
    itemBlocks.length === blogOutputs.length && itemBlocks.length > 0,
    `RSS feed: expected ${blogOutputs.length} <item> entries, found ${itemBlocks.length}`
  );

  const itemLinks = itemBlocks.map((item) => item.match(/<link>([^<]+)<\/link>/i)?.[1] ?? '');
  passOrFail(
    itemLinks.length > 0 && itemLinks.every((link) => link.startsWith(`${siteRoot}blog/`)),
    `RSS feed: every item link should start with ${siteRoot}blog/`
  );
  passOrFail(!rss.includes('undefined'), 'RSS feed: output should not contain undefined values');
  passOrFail(
    itemBlocks.every((item) => item.includes('<content:encoded>')),
    'RSS feed: every item should contain rendered article content'
  );
}

async function verifyPagefind() {
  const pagefindDir = path.join(distDir, 'pagefind');
  const requiredAssets = [
    'pagefind.js',
    'pagefind-component-ui.js',
    'pagefind-component-ui.css',
    'pagefind-entry.json'
  ];

  for (const asset of requiredAssets) {
    await requireFile(path.join(pagefindDir, asset), `Pagefind asset ${asset}`);
  }

  let pagefindFiles = [];
  try {
    pagefindFiles = await listFiles(pagefindDir);
  } catch {
    failures.push(`Pagefind index: cannot read ${relativePath(pagefindDir)}`);
    return;
  }

  for (const extension of ['.pf_index', '.pf_meta', '.pf_fragment']) {
    if (pagefindFiles.some((filePath) => filePath.endsWith(extension))) {
      passedChecks += 1;
    } else {
      failures.push(`Pagefind index: no ${extension} artifact found`);
    }
  }

  try {
    const entry = JSON.parse(await readFile(path.join(pagefindDir, 'pagefind-entry.json'), 'utf8'));
    passedChecks += 1;

    const indexedPageCount = Object.values(entry.languages ?? {}).reduce(
      (total, language) => total + Number(language.page_count ?? 0),
      0
    );
    const htmlFiles = (await listFiles(distDir)).filter((filePath) => filePath.endsWith('.html'));
    let indexablePageCount = 0;
    for (const htmlPath of htmlFiles) {
      const html = await readFile(htmlPath, 'utf8');
      if (html.includes('data-pagefind-body') && !html.includes('name="robots" content="noindex')) {
        indexablePageCount += 1;
      }
    }
    passOrFail(
      indexedPageCount > 0 && indexedPageCount === indexablePageCount,
      `Pagefind index: expected ${indexablePageCount} indexed page(s), found ${indexedPageCount}`
    );
  } catch {
    failures.push('Pagefind index: pagefind-entry.json is not valid JSON');
  }
}

async function verifyNoPlaceholders() {
  const files = (await listFiles(distDir)).filter(
    (filePath) => !filePath.startsWith(`${path.join(distDir, 'pagefind')}${path.sep}`)
  );
  const matches = new Map();

  for (const filePath of files) {
    const contents = await readFile(filePath);
    for (const marker of placeholderMarkers) {
      if (contents.includes(Buffer.from(marker))) {
        const matchedFiles = matches.get(marker) ?? [];
        matchedFiles.push(relativePath(filePath));
        matches.set(marker, matchedFiles);
      }
    }
  }

  if (matches.size === 0) {
    passedChecks += 1;
    return;
  }

  for (const [marker, matchedFiles] of matches) {
    const preview = matchedFiles.slice(0, 5).join(', ');
    const remainder = matchedFiles.length > 5 ? ` (+${matchedFiles.length - 5} more)` : '';
    failures.push(`template marker "${marker}" found in ${preview}${remainder}`);
  }
}

async function verifyDeploymentMetadata() {
  const indexHtml = await readFile(routeOutput('/'), 'utf8');
  const searchHtml = await readFile(routeOutput('/search/'), 'utf8');
  const blogOutputs = await listDetailOutputs('blog');
  const projectOutputs = await listDetailOutputs('projects');
  const firstArticleHtml = blogOutputs.length > 0 ? await readFile(blogOutputs[0], 'utf8') : '';
  const firstProjectHtml = projectOutputs.length > 0 ? await readFile(projectOutputs[0], 'utf8') : '';
  const robots = await readFile(path.join(distDir, 'robots.txt'), 'utf8');
  const sitemap = await readFile(path.join(distDir, 'sitemap-0.xml'), 'utf8');
  const socialImageUrl = `${siteRoot}images/og.png`;

  const expectations = [
    [indexHtml.includes(`<link rel="canonical" href="${siteRoot}"`), `home canonical should be ${siteRoot}`],
    [indexHtml.includes(`<meta property="og:image" content="${socialImageUrl}"`), `Open Graph image should be ${socialImageUrl}`],
    [indexHtml.includes(`<meta name="twitter:image" content="${socialImageUrl}"`), `Twitter image should be ${socialImageUrl}`],
    [indexHtml.includes(`href="${basePath}site.webmanifest"`), 'home should link the web app manifest'],
    [indexHtml.includes(`href="${basePath}blog/"`), `home links should use base path ${basePath}`],
    [searchHtml.includes(`${basePath}pagefind/pagefind-component-ui.js`), 'search Component UI should use the deployment base path'],
    [robots.includes(`Sitemap: ${siteRoot}sitemap-index.xml`), 'robots.txt should point to the deployed sitemap'],
    [sitemap.includes(`<loc>${siteRoot}</loc>`), 'sitemap should include the deployed site root'],
    [sitemap.includes(`${siteRoot}archives/`), 'sitemap should include the article archive'],
    [!sitemap.includes('/signature-lab/'), 'signature lab should not be published'],
    [firstArticleHtml.includes('property="article:published_time"'), 'articles should expose published time metadata'],
    [firstArticleHtml.includes('type="application/ld+json"'), 'articles should expose JSON-LD metadata'],
    [!/<meta property="og:image" content="[^"]+\.svg(?:[?#][^"]*)?"/i.test(firstProjectHtml), 'project social images should not use SVG']
  ];

  for (const [passed, message] of expectations) {
    if (passed) passedChecks += 1;
    else failures.push(`deployment metadata: ${message}`);
  }

  const astroHtmlFiles = (await listFiles(distDir)).filter(
    (filePath) => filePath.endsWith('.html') && !filePath.includes(`${path.sep}signature-candidates${path.sep}`)
  );
  const invalidInternalUrls = [];
  const invalidCanonicals = [];

  for (const htmlPath of astroHtmlFiles) {
    const html = await readFile(htmlPath, 'utf8');
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    const isNoindex = html.includes('name="robots" content="noindex');
    const relativeDirectory = path.relative(distDir, path.dirname(htmlPath));
    const encodedRoute = htmlPath === path.join(distDir, '404.html')
      ? '404'
      : relativeDirectory
          .split(path.sep)
          .filter(Boolean)
          .map(encodeURIComponent)
          .join('/');
    const expectedCanonical = new URL(encodedRoute ? `${encodedRoute}/` : '', siteRoot).toString();
    if ((isNoindex && canonical) || (!isNoindex && canonical !== expectedCanonical)) {
      const expected = isNoindex ? 'omitted on noindex pages' : expectedCanonical;
      invalidCanonicals.push(`${relativePath(htmlPath)} -> ${canonical ?? 'missing'} (expected ${expected})`);
    }

    for (const match of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
      if (!match[1].startsWith(basePath)) invalidInternalUrls.push(`${relativePath(htmlPath)} -> ${match[1]}`);
    }
  }

  passOrFail(
    invalidCanonicals.length === 0,
    `deployment metadata: invalid canonical on ${invalidCanonicals.slice(0, 5).join(', ')}`
  );
  passOrFail(
    invalidInternalUrls.length === 0,
    `deployment metadata: internal URL missing base path: ${invalidInternalUrls.slice(0, 5).join(', ')}`
  );

  await requireFile(path.join(distDir, 'images', 'og.png'), 'social sharing image');
}

async function verifyProductionAssets() {
  const leakedPaths = [
    path.join(distDir, 'signature-lab', 'index.html'),
    path.join(distDir, 'signature-candidates')
  ];

  for (const leakedPath of leakedPaths) {
    passOrFail(
      !(await pathExists(leakedPath)),
      `production assets: archived signature lab leaked into ${relativePath(leakedPath)}`
    );
  }
}

async function main() {
  let distStat;
  try {
    distStat = await stat(distDir);
  } catch {
    console.error('Build verification failed: dist/ does not exist. Run the production build first.');
    process.exitCode = 1;
    return;
  }

  if (!distStat.isDirectory()) {
    console.error('Build verification failed: dist is not a directory.');
    process.exitCode = 1;
    return;
  }

  await verifyRoutes();
  await verifyRss();
  await verifyPagefind();
  await verifyNoPlaceholders();
  await verifyDeploymentMetadata();
  await verifyProductionAssets();

  if (failures.length > 0) {
    console.error(`Build verification failed with ${failures.length} problem(s):`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
    return;
  }

  console.log(`Build verification passed (${passedChecks} checks).`);
}

main().catch((error) => {
  console.error('Build verification failed with an unexpected error:');
  console.error(error);
  process.exitCode = 1;
});
