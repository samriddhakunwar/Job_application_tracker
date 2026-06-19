export type JobType = 'Internship' | 'FullTime' | 'PartTime';
export type Status = 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';

export interface Application {
  id: string;
  companyName: string;
  jobTitle: string;
  jobType: JobType;
  status: Status;
  appliedDate: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedApplications {
  data: Application[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const jobTypeOptions: { value: JobType; label: string }[] = [
  { value: 'Internship', label: 'Internship' },
  { value: 'FullTime', label: 'Full Time' },
  { value: 'PartTime', label: 'Part Time' },
];

export const statusOptions: Status[] = ['Applied', 'Interviewing', 'Offer', 'Rejected'];
