import { z } from 'zod';

export const jobTypes = ['Internship', 'FullTime', 'PartTime'] as const;
export const statuses = ['Applied', 'Interviewing', 'Offer', 'Rejected'] as const;

export const createApplicationSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  jobTitle: z.string().min(1, 'Job title is required'),
  jobType: z.enum(jobTypes),
  status: z.enum(statuses).default('Applied'),
  appliedDate: z.coerce.date({ required_error: 'Applied date is required' }),
  notes: z.string().optional(),
});

// Every field optional on update so the user can change just one thing.
export const updateApplicationSchema = createApplicationSchema.partial();

export const listQuerySchema = z.object({
  status: z.enum(statuses).optional(),
  search: z.string().trim().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;
export type ListQuery = z.infer<typeof listQuerySchema>;
