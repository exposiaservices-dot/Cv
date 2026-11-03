import { portfolioDataSchema } from './schema';
import { hasText, validLink } from './content';
export { hasText, safeUrl, validLink } from './content';
import type { PortfolioData } from './types';

const recordHasText = (record: object) => Object.values(record).some(value => typeof value === 'string' && hasText(value));
export function isPortfolioBlank(data: PortfolioData): boolean {
  return !recordHasText(data.identity) && !hasText(data.about) &&
    !data.projects.some(p => hasText(p.title) || hasText(p.summary) || hasText(p.detail) || p.tags.some(hasText) || p.links.some(recordHasText)) &&
    !data.skills.some(hasText) && !data.experience.some(recordHasText) && !data.education.some(recordHasText) && !data.contact.some(recordHasText);
}
export type PortfolioStatus = 'blank' | 'partial' | 'complete';
export interface PortfolioValidation { status: PortfolioStatus; issues: string[] }
/** Complete means name, about, one titled project, and one valid contact; other fields are optional. */
export function validatePortfolio(input: unknown): PortfolioValidation {
  const parsed = portfolioDataSchema.safeParse(input);
  if (!parsed.success) {
    return { status: 'partial', issues: parsed.error.issues.map(issue => `schema.${issue.path.join('.') || 'root'}`) };
  }
  const data = parsed.data;
  if (isPortfolioBlank(data)) return { status: 'blank', issues: [] };
  const issues: string[] = [];
  if (!hasText(data.identity.name)) issues.push('identity.name');
  if (!hasText(data.about)) issues.push('about');
  if (!data.projects.some(p => hasText(p.title))) issues.push('projects.title');
  if (!data.contact.some(validLink)) issues.push('contact');
  if ([...data.contact, ...data.projects.flatMap(p => p.links)].some(link => (hasText(link.label) || hasText(link.url)) && !validLink(link))) issues.push('links.invalid');
  return { status: issues.length ? 'partial' : 'complete', issues };
}
