'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Application, jobTypeOptions, statusOptions } from '@/lib/types';

const formSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  jobTitle: z.string().min(1, 'Job title is required'),
  jobType: z.enum(['Internship', 'FullTime', 'PartTime']),
  status: z.enum(['Applied', 'Interviewing', 'Offer', 'Rejected']),
  appliedDate: z.string().min(1, 'Applied date is required'),
  notes: z.string().optional(),
});

export type ApplicationFormValues = z.infer<typeof formSchema>;

interface ApplicationFormProps {
  initialData?: Application;
  submitLabel: string;
  onSubmit: (values: ApplicationFormValues) => Promise<void>;
}

function toDateInput(value?: string) {
  if (!value) return '';
  return new Date(value).toISOString().split('T')[0];
}

export default function ApplicationForm({
  initialData,
  submitLabel,
  onSubmit,
}: ApplicationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: initialData?.companyName ?? '',
      jobTitle: initialData?.jobTitle ?? '',
      jobType: initialData?.jobType ?? 'Internship',
      status: initialData?.status ?? 'Applied',
      appliedDate: toDateInput(initialData?.appliedDate),
      notes: initialData?.notes ?? '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Company Name</label>
        <input
          {...register('companyName')}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
        {errors.companyName && (
          <p className="mt-1 text-xs text-red-600">{errors.companyName.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Job Title</label>
        <input
          {...register('jobTitle')}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
        {errors.jobTitle && <p className="mt-1 text-xs text-red-600">{errors.jobTitle.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Job Type</label>
          <select
            {...register('jobType')}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          >
            {jobTypeOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
          <select
            {...register('status')}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Applied Date</label>
        <input
          type="date"
          {...register('appliedDate')}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
        {errors.appliedDate && (
          <p className="mt-1 text-xs text-red-600">{errors.appliedDate.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Notes</label>
        <textarea
          {...register('notes')}
          rows={4}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
      >
        {isSubmitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
