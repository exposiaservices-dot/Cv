import type { TypographyConfig } from '@/fonts';

export interface PortfolioLink { label: string; url: string }
export interface Project {
  id: string;
  title: string;
  summary: string;
  detail: string;
  tags: string[];
  links: PortfolioLink[];
}
export interface Experience { role: string; organization: string; period: string; description: string }
export interface Education { qualification: string; institution: string; period: string; description: string }
export interface PortfolioData {
  identity: { name: string; title: string; location: string };
  about: string;
  projects: Project[];
  skills: string[];
  experience: Experience[];
  education: Education[];
  contact: PortfolioLink[];
}
export type SectionId = 'identity' | 'about' | 'projects' | 'skills' | 'experience' | 'education' | 'contact';
export interface PortfolioDesign {
  lang: string;
  direction: 'rtl' | 'ltr';
  sections: { id: SectionId; visible: boolean }[];
  labels: Record<Exclude<SectionId, 'identity'>, string>;
  colors: { background: string; surface: string; text: string; muted: string; accent: string };
  maxWidth: string;
  typography: TypographyConfig;
}
