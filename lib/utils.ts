// lib/utils.ts
export function normalizeUrl(str: string): string | null {
  if (!str.trim()) return null;

  let urlString = str.trim();
  if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
    urlString = `https://${urlString}`;
  }

  try {
    const url = new URL(urlString);
    return url.href;
  } catch {
    return null;
  }
}
