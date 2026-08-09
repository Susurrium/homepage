const baseUrl = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const externalProtocol = /^[a-z][a-z\d+.-]*:/i;

/** Prefix an internal site path with Astro's configured base path. */
export function withBase(path: string) {
  if (!path || path.startsWith('#') || path.startsWith('//') || externalProtocol.test(path)) {
    return path;
  }

  const relativePath = path.replace(/^\/+/, '');
  return relativePath ? `${baseUrl}${relativePath}` : baseUrl;
}
