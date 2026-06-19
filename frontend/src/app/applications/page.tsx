'use client';

import { useEffect, useState } from 'react';
import ApplicationTable from '@/components/ApplicationTable';
import FilterBar from '@/components/FilterBar';
import DeleteModal from '@/components/DeleteModal';
import { deleteApplication, getApplications } from '@/lib/api';
import { Application } from '@/lib/types';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [status, setStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [toDelete, setToDelete] = useState<Application | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadApplications() {
    setLoading(true);
    setError('');
    try {
      const result = await getApplications({ status, search, page });
      setApplications(result.data);
      setTotalPages(result.totalPages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  }

  // Debounce so we don't hit the API on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      loadApplications();
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, search, page]);

  // Reset to the first page whenever the filters change.
  useEffect(() => {
    setPage(1);
  }, [status, search]);

  async function handleConfirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteApplication(toDelete.id);
      setToDelete(null);
      loadApplications();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete application');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-800">Applications</h1>

      <FilterBar
        status={status}
        search={search}
        onStatusChange={setStatus}
        onSearchChange={setSearch}
      />

      {loading ? (
        <p className="py-10 text-center text-sm text-slate-500">Loading applications...</p>
      ) : error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-700">
          {error}
          <div className="mt-3">
            <button onClick={loadApplications} className="font-medium underline">
              Try again
            </button>
          </div>
        </div>
      ) : applications.length === 0 ? (
        <div className="rounded-lg border bg-white px-4 py-12 text-center text-sm text-slate-500">
          No applications found. Start by adding one.
        </div>
      ) : (
        <>
          <ApplicationTable applications={applications} onDelete={setToDelete} />

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-4 text-sm">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-md border border-slate-300 px-3 py-1.5 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-slate-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded-md border border-slate-300 px-3 py-1.5 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <DeleteModal
        open={!!toDelete}
        companyName={toDelete?.companyName}
        loading={deleting}
        onCancel={() => setToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
