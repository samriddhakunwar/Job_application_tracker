'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import DeleteModal from '@/components/DeleteModal';
import { deleteApplication, getApplication } from '@/lib/api';
import { Application, jobTypeOptions } from '@/lib/types';

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function ViewApplicationPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getApplication(params.id);
        setApplication(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load application');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteApplication(params.id);
      router.push('/applications');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete application');
      setDeleting(false);
    }
  }

  if (loading) {
    return <p className="py-10 text-center text-sm text-slate-500">Loading...</p>;
  }

  if (error || !application) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-700">
        {error || 'Application not found'}
      </div>
    );
  }

  const jobTypeLabel =
    jobTypeOptions.find((o) => o.value === application.jobType)?.label ?? application.jobType;

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/applications" className="text-sm text-slate-500 hover:underline">
        &larr; Back to applications
      </Link>

      <div className="mt-2 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">{application.companyName}</h1>
          <p className="text-slate-600">{application.jobTitle}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/applications/${application.id}/edit`}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Edit
          </Link>
          <button
            onClick={() => setShowDelete(true)}
            className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-4 rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex justify-between">
          <span className="text-sm text-slate-500">Status</span>
          <StatusBadge status={application.status} />
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-slate-500">Job Type</span>
          <span className="text-sm text-slate-800">{jobTypeLabel}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-slate-500">Applied Date</span>
          <span className="text-sm text-slate-800">{formatDate(application.appliedDate)}</span>
        </div>
        <div>
          <span className="text-sm text-slate-500">Notes</span>
          <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">
            {application.notes || '—'}
          </p>
        </div>
      </div>

      <DeleteModal
        open={showDelete}
        companyName={application.companyName}
        loading={deleting}
        onCancel={() => setShowDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
