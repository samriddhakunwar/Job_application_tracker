'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ApplicationForm, { ApplicationFormValues } from '@/components/ApplicationForm';
import { getApplication, updateApplication } from '@/lib/api';
import { Application } from '@/lib/types';

export default function EditApplicationPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  async function handleSubmit(values: ApplicationFormValues) {
    setError('');
    try {
      await updateApplication(params.id, values);
      router.push(`/applications/${params.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update application');
    }
  }

  if (loading) {
    return <p className="py-10 text-center text-sm text-slate-500">Loading...</p>;
  }

  if (error && !application) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link href={`/applications/${params.id}`} className="text-sm text-slate-500 hover:underline">
        &larr; Back
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-semibold text-slate-800">Edit Application</h1>

      {error && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <ApplicationForm
          initialData={application ?? undefined}
          submitLabel="Save Changes"
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
