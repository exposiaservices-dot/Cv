import type { PortfolioData, PortfolioDesign } from '@/portfolio/types';

// Intentionally empty. Only publish information supplied and approved by the owner.
export const portfolio: PortfolioData = {
  identity: { name: '', title: '', location: '' },
  about: '', projects: [], skills: [], experience: [], education: [], contact: [],
};

export const portfolioDesign: PortfolioDesign = {
  lang: 'ar', direction: 'rtl',
  sections: [
    { id: 'identity', visible: true }, { id: 'about', visible: true },
    { id: 'projects', visible: true }, { id: 'skills', visible: true },
    { id: 'experience', visible: true }, { id: 'education', visible: true },
    { id: 'contact', visible: true },
  ],
  labels: { about: 'نبذة', projects: 'المشاريع', skills: 'المهارات', experience: 'الخبرة', education: 'التعليم', contact: 'التواصل' },
  colors: { background: '#0b1220', surface: '#182438', text: '#f5f7fa', muted: '#cad3df', accent: '#8de1d0' },
  maxWidth: '72rem', typography: { preset: 'default' },
};
