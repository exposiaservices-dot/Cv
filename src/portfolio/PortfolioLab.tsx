import Portfolio from './Portfolio';
import type { PortfolioData } from './types';
import { portfolioDesign } from '@/data/portfolio';
import fixtureImage from './fixtures/project.svg';
// Synthetic fixture, loaded only by ?lab=portfolio; never imported by the default entry.
const fixture: PortfolioData = {
  identity: { name: 'اسم تجريبي', title: 'عنوان تجريبي', location: '' },
  about: 'نص تجريبي مخصص لاختبار العرض فقط.',
  projects: [{ id: 'fixture', title: 'مشروع تجريبي', summary: 'وصف تجريبي', detail: 'تفاصيل تجريبية', tags: ['تجربة'], links: [], images: [{ src: fixtureImage, alt: 'رسم تجريبي لاختبار معرض الصور' }] }],
  skills: ['مهارة تجريبية'], experience: [], education: [], contact: [{ label: 'بريد تجريبي', url: 'mailto:fixture@example.invalid' }],
};
export default function PortfolioLab() { return <><div role="note" style={{ padding: '1rem', textAlign: 'center' }}>مختبر المحفظة — بيانات تجريبية فقط</div><Portfolio data={fixture} design={portfolioDesign} /></>; }
