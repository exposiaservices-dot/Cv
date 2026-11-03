import type { PortfolioLink } from './types';

export const hasText = (value: string) => value.trim().length > 0;
/** Allow only ordinary web/mail/phone links or same-site relative paths. */
export function safeUrl(url: string): string | undefined {
  const value = url.trim();
  if (!value || /[\u0000-\u001f\u007f]/.test(value)) return undefined;
  if (/^(https?:\/\/|mailto:|tel:)/i.test(value)) {
    try {
      const parsed = new URL(value);
      if ((parsed.protocol === 'http:' || parsed.protocol === 'https:') && !parsed.hostname) return undefined;
      return value;
    } catch { return undefined; }
  }
  if (/^(\/[^/\\]|\/\/|#|\.\.?\/)/.test(value) && !value.startsWith('//') && !value.includes('\\')) return value;
  return undefined;
}
export const validLink = (link: PortfolioLink) => hasText(link.label) && Boolean(safeUrl(link.url));
