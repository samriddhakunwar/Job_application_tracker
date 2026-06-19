'use client';

import Link from 'next/link';
import { Application, jobTypeOptions } from '@/lib/types';
import StatusBadge from './StatusBadge';

interface ApplicationTableProps {
  applications: Application[];
  onDelete: (application: Application) => void;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function jobTypeLabel(value: string) {
  return jobTypeOptions.find((o) => o.value === value)?.label ?? value;
}

export default function ApplicationTable({ applications, onDelete }: ApplicationTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Job Title</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Applied Date</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {applications.map((app) => (
            <tr key={app.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-800">{app.companyName}</td>
              <td className="px-4 py-3 text-slate-700">{app.jobTitle}</td>
              <td className="px-4 py-3 text-slate-700">{jobTypeLabel(app.jobType)}</td>
              <td className="px-4 py-3">
                <StatusBadge status={app.status} />
              </td>
              <td className="px-4 py-3 text-slate-700">{formatDate(app.appliedDate)}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-3 text-sm">
                  <Link href={`/applications/${app.id}`} className="text-slate-600 hover:underline">
                    View
                  </Link>
                  <Link
                    href={`/applications/${app.id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button onClick={() => onDelete(app)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
