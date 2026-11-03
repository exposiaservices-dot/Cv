import { z } from 'zod';
import type { PortfolioData } from './types';

// Runtime boundary for JSON or other untrusted input. No demo values or defaults.
const linkSchema = z.strictObject({ label: z.string(), url: z.string() });
const projectSchema = z.strictObject({
  id: z.string(), title: z.string(), summary: z.string(), detail: z.string(),
  tags: z.array(z.string()), links: z.array(linkSchema),
  images: z.array(z.strictObject({ src: z.string(), alt: z.string() })).optional(),
});
const experienceSchema = z.strictObject({ role: z.string(), organization: z.string(), period: z.string(), description: z.string() });
const educationSchema = z.strictObject({ qualification: z.string(), institution: z.string(), period: z.string(), description: z.string() });
export const portfolioDataSchema: z.ZodType<PortfolioData> = z.strictObject({
  identity: z.strictObject({ name: z.string(), title: z.string(), location: z.string() }),
  about: z.string(), projects: z.array(projectSchema), skills: z.array(z.string()),
  experience: z.array(experienceSchema), education: z.array(educationSchema), contact: z.array(linkSchema),
});
