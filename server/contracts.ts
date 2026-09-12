import { z } from 'zod';

export const statuses = ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'] as const;
export const applicationSchema = z.object({
  id: z.string().min(1),
  company: z.string().trim().min(1).max(100),
  role: z.string().trim().min(1).max(120),
  status: z.enum(statuses),
  fitScore: z.number().int().min(0).max(100),
  date: z.iso.date(),
  location: z.string().trim().min(1).max(120)
});
export const createApplicationSchema = applicationSchema.omit({ id: true });
export const updateApplicationSchema = z.object({ status: z.enum(statuses) }).strict();
export const applicationIdSchema = z.string().min(1).max(128);

export type StoredApplication = z.infer<typeof applicationSchema>;
