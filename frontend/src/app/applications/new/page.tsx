'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ApplicationForm, { ApplicationFormValues } from '@/components/ApplicationForm';
import { createApplication } from '@/lib/api';

export default function NewApplicationPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  async function handleSubmit(values: ApplicationFormValues) {
    setError('');
    try {
      await createApplication(values);
      router.push('/applications');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create application');
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/applications" className="text-sm text-slate-500 hover:underline">
        &larr; Back to applications
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-semibold text-slate-800">Add Application</h1>

      {error && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <ApplicationForm submitLabel="Create Application" onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
