// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import axe from 'axe-core';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Portfolio from '@/portfolio/Portfolio';
import { portfolio, portfolioDesign } from '@/data/portfolio';
import type { PortfolioData, PortfolioDesign } from '@/portfolio/types';

(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
const roots: ReturnType<typeof createRoot>[] = [];
afterEach(async () => {
  for (const root of roots.splice(0)) await act(async () => root.unmount());
  document.body.innerHTML = '';
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
function mount(data: PortfolioData, design: PortfolioDesign = portfolioDesign) {
  const element = document.createElement('div'); document.body.append(element);
  const root = createRoot(element); roots.push(root);
  return { root, element, render: async () => { await act(async () => root.render(<Portfolio data={data} design={design} />)); } };
}
function sample(): PortfolioData {
  const d = structuredClone(portfolio);
  d.identity.name = 'اسم تجريبي'; d.about = 'نص تجريبي';
  d.projects = [{ id: 'fixture', title: 'مشروع تجريبي', summary: '', detail: '', tags: [], links: [], images: [{ src: '/test.svg', alt: 'رسم تجريبي' }] }];
  d.contact = [{ label: 'بريد تجريبي', url: 'mailto:test@example.invalid' }];
  return d;
}
describe('portfolio accessibility', () => {
  it('has no detectable axe violations for deliberately blank content in jsdom', async () => {
    const view = mount(structuredClone(portfolio)); await view.render();
    const result = await axe.run(view.element, { rules: { 'color-contrast': { enabled: false } } });
    expect(result.violations.map(issue => issue.id)).toEqual([]);
  });
  it('has no detectable axe violations for populated RTL content in jsdom', async () => {
    const view = mount(sample()); await view.render();
    // jsdom cannot calculate real layout or color contrast; those require a browser.
    const result = await axe.run(view.element, { rules: { 'color-contrast': { enabled: false } } });
    expect(result.violations.map(issue => `${issue.id}: ${issue.help}`)).toEqual([]);
  });
  it('uses LTR and English labels when the design language changes', async () => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
    const view = mount(sample(), { ...portfolioDesign, lang: 'en', direction: 'ltr' }); await view.render();
    const trigger = view.element.querySelector('button.portfolio-media-button') as HTMLButtonElement;
    expect(trigger.getAttribute('aria-label')).toContain('View image');
    await act(async () => { trigger.click(); await import('@/portfolio/ProjectMediaViewer'); });
    await vi.waitFor(() => expect(document.querySelector('.yarl__root')).not.toBeNull());
    expect(document.querySelector('.yarl__root')?.getAttribute('dir')).toBe('ltr');
    expect(document.querySelector('[aria-label="Close"]')).not.toBeNull();
  });
  it('opens the lazy viewer and Escape closes it', async () => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
    const view = mount(sample()); await view.render();
    const trigger = view.element.querySelector('button.portfolio-media-button') as HTMLButtonElement;
    expect(trigger).not.toBeNull();
    await act(async () => { trigger.click(); await import('@/portfolio/ProjectMediaViewer'); });
    await vi.waitFor(() => expect(document.querySelector('.yarl__root')).not.toBeNull());
    expect(document.querySelector('[aria-label="إغلاق"]')).not.toBeNull();
    expect(document.querySelector('.yarl__root')?.getAttribute('dir')).toBe('rtl');
    expect((document.querySelector('.yarl__root') as HTMLElement).style.getPropertyValue('--yarl__fade_animation_duration')).toBe('0ms');
    await act(async () => { document.querySelector('.yarl__container')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); });
    await vi.waitFor(() => expect(document.querySelector('.yarl__root')).toBeNull());
    await vi.waitFor(() => expect(document.activeElement).toBe(trigger));
  });
});
