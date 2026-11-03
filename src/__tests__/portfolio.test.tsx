import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import Portfolio from '@/portfolio/Portfolio';
import { portfolio, portfolioDesign } from '@/data/portfolio';
import { isPortfolioBlank, safeUrl, validatePortfolio } from '@/portfolio/validate';
import type { PortfolioData } from '@/portfolio/types';

const blank = (): PortfolioData => structuredClone(portfolio);
const render = (data: PortfolioData, design = portfolioDesign) => renderToStaticMarkup(<Portfolio data={data} design={design} />);
describe('portfolio template', () => {
  it('ships genuinely blank and hides every empty section and label', () => {
    expect(isPortfolioBlank(portfolio)).toBe(true);
    expect(validatePortfolio(portfolio)).toEqual({ status: 'blank', issues: [] });
    const html = render(portfolio);
    expect(html).not.toMatch(/<h[1-6]|<section|<a |Lorem|نبذة|المشاريع|المهارات|الخبرة|التعليم|التواصل|تجريبي/);
    expect(html).toContain('dir="rtl"');
  });
  it('ignores whitespace and empty records, not IDs alone', () => {
    const d = blank(); d.identity.name = '  '; d.skills = [' '];
    d.projects = [{ id: 'internal-id', title: '', summary: ' ', detail: '', tags: [], links: [] }];
    expect(isPortfolioBlank(d)).toBe(true);
    expect(render(d)).not.toContain('internal-id');
  });
  it('renders partial content without unrelated headings or personal placeholders', () => {
    const d = blank(); d.identity.title = 'عنوان مخصص'; d.skills = ['اختبار'];
    expect(validatePortfolio(d).status).toBe('partial');
    const html = render(d);
    expect(html).toContain('عنوان مخصص'); expect(html).toContain('اختبار');
    expect(html).not.toMatch(/<h1|نبذة|المشاريع|التواصل|Lorem/);
  });
  it('renders a complete portfolio and every populated section', () => {
    const d = blank();
    d.identity = { name: 'اسم الاختبار', title: 'دور الاختبار', location: 'موقع الاختبار' }; d.about = 'نبذة الاختبار';
    d.projects = [{ id: 'p', title: 'مشروع الاختبار', summary: 'ملخص', detail: 'تفصيل', tags: ['وسم'], links: [{ label: 'رابط', url: 'https://example.invalid/' }] }];
    d.skills = ['مهارة']; d.experience = [{ role: 'دور', organization: 'جهة', period: 'مدة', description: 'وصف' }];
    d.education = [{ qualification: 'مؤهل', institution: 'مؤسسة', period: 'مدة', description: 'وصف' }];
    d.contact = [{ label: 'بريد', url: 'mailto:test@example.invalid' }];
    expect(validatePortfolio(d)).toEqual({ status: 'complete', issues: [] });
    const html = render(d); for (const text of ['اسم الاختبار', 'نبذة الاختبار', 'مشروع الاختبار', 'تفصيل', 'مهارة', 'جهة', 'مؤسسة', 'mailto:test@example.invalid']) expect(html).toContain(text);
  });
  it('respects visibility, ordering and direction', () => {
    const d = blank(); d.about = 'ABOUT'; d.skills = ['SKILL'];
    const design = { ...portfolioDesign, lang: 'en', direction: 'ltr' as const, sections: [{ id: 'skills' as const, visible: true }, { id: 'about' as const, visible: false }] };
    const html = render(d, design); expect(html).toContain('dir="ltr"'); expect(html).toContain('SKILL'); expect(html).not.toContain('ABOUT');
    const ordered = render(d, { ...design, sections: [{ id: 'skills', visible: true }, { id: 'about', visible: true }] });
    expect(ordered.indexOf('SKILL')).toBeLessThan(ordered.indexOf('ABOUT'));
  });
  it('validates unknown runtime data without throwing or leaking its values', () => {
    expect(validatePortfolio(null)).toEqual({ status: 'partial', issues: ['schema.root'] });
    const malformed = { ...blank(), skills: [42], identity: { ...blank().identity, name: 123 } };
    const result = validatePortfolio(malformed);
    expect(result.status).toBe('partial');
    expect(result.issues).toContain('schema.skills.0');
    expect(result.issues).toContain('schema.identity.name');
    expect(JSON.stringify(result)).not.toContain('123');
    expect(validatePortfolio({ ...blank(), unexpected: 'sensitive' }).issues).toContain('schema.root');
  });
  it('rejects unsafe and incomplete links without emitting anchors', () => {
    const d = blank(); d.contact = [{ label: 'bad', url: 'javascript:alert(1)' }, { label: '', url: 'https://example.invalid' }];
    expect(validatePortfolio(d).issues).toContain('links.invalid'); expect(render(d)).not.toContain('<a ');
    for (const url of ['//evil.test', 'javascript:alert(1)', 'data:text/html,x', '/\\evil.test']) expect(safeUrl(url)).toBeUndefined();
    expect(safeUrl('/page')).toBe('/page'); expect(safeUrl('https://example.invalid')).toBeTruthy();
  });
});
