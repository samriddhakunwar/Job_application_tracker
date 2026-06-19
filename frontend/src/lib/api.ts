import { Application, PaginatedApplications } from './types';

// On Vercel (services) NEXT_PUBLIC_BACKEND_URL is injected automatically as "/api".
// Locally we fall back to the backend dev server, which also serves under /api.
const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:4000/api';

async function handleResponse(res: Response) {
  if (!res.ok) {
    let message = 'Request failed';
    try {
      const body = await res.json();
      message = body.message || message;
    } catch {
      // response had no JSON body
    }
    throw new Error(message);
  }
  return res;
}

export interface ListParams {
  status?: string;
  search?: string;
  page?: number;
}

export async function getApplications(params: ListParams = {}): Promise<PaginatedApplications> {
  const query = new URLSearchParams();
  if (params.status && params.status !== 'All') query.set('status', params.status);
  if (params.search) query.set('search', params.search);
  if (params.page) query.set('page', String(params.page));

  const res = await fetch(`${API_URL}/applications?${query.toString()}`, { cache: 'no-store' });
  await handleResponse(res);
  return res.json();
}

export async function getApplication(id: string): Promise<Application> {
  const res = await fetch(`${API_URL}/applications/${id}`, { cache: 'no-store' });
  await handleResponse(res);
  return res.json();
}

export async function createApplication(data: Record<string, unknown>): Promise<Application> {
  const res = await fetch(`${API_URL}/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  await handleResponse(res);
  return res.json();
}

export async function updateApplication(
  id: string,
  data: Record<string, unknown>
): Promise<Application> {
  const res = await fetch(`${API_URL}/applications/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  await handleResponse(res);
  return res.json();
}

export async function deleteApplication(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/applications/${id}`, { method: 'DELETE' });
  await handleResponse(res);
}
