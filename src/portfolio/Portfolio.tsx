import { Fragment, type CSSProperties, type ReactNode } from 'react';
import type { GalleryLabels, PortfolioData, PortfolioDesign, PortfolioLink, Project, SectionId } from './types';
import { hasText, safeUrl, validImage, validLink } from './content';
import { ProjectMedia } from './ProjectMedia';
import './portfolio.css';

function Links({ links }: { links: PortfolioLink[] }) {
  const items = links.filter(validLink);
  return items.length ? <ul className="portfolio-links">{items.map((link, i) => <li key={i}><a href={safeUrl(link.url)}>{link.label}</a></li>)}</ul> : null;
}
export function Identity({ data }: { data: PortfolioData['identity'] }) {
  if (![data.name, data.title, data.location].some(hasText)) return null;
  return <header className="portfolio-identity">{hasText(data.name) && <h1>{data.name}</h1>}{hasText(data.title) && <p className="portfolio-title">{data.title}</p>}{hasText(data.location) && <p>{data.location}</p>}</header>;
}
export function ProjectDetail({ project, lang = 'ar', direction = 'rtl', galleryLabels }: { project: Project; lang?: string; direction?: 'rtl' | 'ltr'; galleryLabels?: Partial<GalleryLabels> }) {
  return <article className="portfolio-card">{hasText(project.title) && <h3>{project.title}</h3>}{hasText(project.summary) && <p>{project.summary}</p>}{hasText(project.detail) && <p>{project.detail}</p>}{project.tags.some(hasText) && <ul className="portfolio-tags">{project.tags.filter(hasText).map((tag, i) => <li key={i}>{tag}</li>)}</ul>}<Links links={project.links} /><ProjectMedia images={project.images ?? []} lang={lang} direction={direction} galleryLabels={galleryLabels} /></article>;
}
function Section({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return <section id={id} className="portfolio-section" aria-label={hasText(label) ? label : undefined}>{hasText(label) && <h2>{label}</h2>}{children}</section>;
}
export function About({ data, label }: { data: string; label: string }) { return hasText(data) ? <Section id="about" label={label}><p>{data}</p></Section> : null; }
export function Projects({ data, label, lang = 'ar', direction = 'rtl', galleryLabels }: { data: Project[]; label: string; lang?: string; direction?: 'rtl' | 'ltr'; galleryLabels?: Partial<GalleryLabels> }) {
  const items = data.filter(p => [p.title, p.summary, p.detail, ...p.tags].some(hasText) || p.links.some(validLink) || p.images?.some(validImage));
  return items.length ? <Section id="projects" label={label}><div className="portfolio-grid">{items.map((p, i) => <ProjectDetail key={`${p.id}-${i}`} project={p} lang={lang} direction={direction} galleryLabels={galleryLabels} />)}</div></Section> : null;
}
export function Skills({ data, label }: { data: string[]; label: string }) { const items = data.filter(hasText); return items.length ? <Section id="skills" label={label}><ul className="portfolio-tags">{items.map((x, i) => <li key={i}>{x}</li>)}</ul></Section> : null; }
export function Experience({ data, label }: { data: PortfolioData['experience']; label: string }) {
  const items = data.filter(x => [x.role, x.organization, x.period, x.description].some(hasText));
  return items.length ? <Section id="experience" label={label}><div className="portfolio-grid">{items.map((x, i) => <article className="portfolio-card" key={i}>{hasText(x.role) && <h3>{x.role}</h3>}{hasText(x.organization) && <p>{x.organization}</p>}{hasText(x.period) && <p>{x.period}</p>}{hasText(x.description) && <p>{x.description}</p>}</article>)}</div></Section> : null;
}
export function Education({ data, label }: { data: PortfolioData['education']; label: string }) {
  const items = data.filter(x => [x.qualification, x.institution, x.period, x.description].some(hasText));
  return items.length ? <Section id="education" label={label}><div className="portfolio-grid">{items.map((x, i) => <article className="portfolio-card" key={i}>{hasText(x.qualification) && <h3>{x.qualification}</h3>}{hasText(x.institution) && <p>{x.institution}</p>}{hasText(x.period) && <p>{x.period}</p>}{hasText(x.description) && <p>{x.description}</p>}</article>)}</div></Section> : null;
}
export function Contact({ data, label }: { data: PortfolioLink[]; label: string }) { return data.some(validLink) ? <Section id="contact" label={label}><Links links={data} /></Section> : null; }

/** Registry is the single mapping between configurable section IDs and components. */
export const sectionRegistry: Record<SectionId, (data: PortfolioData, design: PortfolioDesign) => ReactNode> = {
  identity: d => <Identity data={d.identity} />,
  about: (d, s) => <About data={d.about} label={s.labels.about} />,
  projects: (d, s) => <Projects data={d.projects} label={s.labels.projects} lang={s.lang} direction={s.direction} galleryLabels={s.galleryLabels} />,
  skills: (d, s) => <Skills data={d.skills} label={s.labels.skills} />,
  experience: (d, s) => <Experience data={d.experience} label={s.labels.experience} />,
  education: (d, s) => <Education data={d.education} label={s.labels.education} />,
  contact: (d, s) => <Contact data={d.contact} label={s.labels.contact} />,
};
export default function Portfolio({ data, design }: { data: PortfolioData; design: PortfolioDesign }) {
  const style = { '--portfolio-bg': design.colors.background, '--portfolio-surface': design.colors.surface, '--portfolio-text': design.colors.text, '--portfolio-muted': design.colors.muted, '--portfolio-accent': design.colors.accent, '--portfolio-width': design.maxWidth } as CSSProperties;
  return <main className="portfolio" lang={design.lang} dir={design.direction} style={style}><div className="portfolio-container">{design.sections.filter(s => s.visible).map((s, i) => <Fragment key={`${s.id}-${i}`}>{sectionRegistry[s.id](data, design)}</Fragment>)}</div></main>;
}
