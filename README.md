# Mini Job Application Tracker

A simple full-stack app to keep track of job and internship applications. You can add applications,
edit them, filter by status, search by company or job title, and delete the ones you no longer need.

## Project Overview

The project is split into two parts:

- **frontend** – a Next.js 15 (App Router) app with the UI for managing applications.
- **backend** – an Express REST API backed by PostgreSQL through Prisma.

Features:

- List all applications in a responsive table with loading, empty and error states
- Add / edit applications using a shared form (React Hook Form + Zod validation)
- View a single application
- Delete with a confirmation modal
- Filter by status and search by company / job title (handled on the backend)
- Pagination

## Tech Stack

**Frontend**

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod

**Backend**

- Express.js + TypeScript
- Prisma ORM
- PostgreSQL
- Zod for request validation
- Jest for testing

## Folder Structure

```
internsathi_project/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── validators/
│   │   ├── lib/
│   │   └── index.ts
│   ├── tests/
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   └── applications/
│   │   ├── components/
│   │   └── lib/
│   ├── .env.example
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Setup Instructions

You need Node.js 20+ and a running PostgreSQL instance. If you have Docker, you can skip the manual
database setup and use `docker-compose` (see the bottom of this file).

### 1. Clone and configure environment variables

```bash
git clone <repo-url>
cd internsathi_project
```

**Backend** – copy the example env file and adjust the database URL if needed:

```bash
cd backend
cp .env.example .env
```

**Frontend** – copy its example env file:

```bash
cd ../frontend
cp .env.example .env
```

### Environment Variables

**backend/.env**

| Variable       | Description                              | Example                                                                 |
| -------------- | ---------------------------------------- | ----------------------------------------------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string for Prisma  | `postgresql://postgres:postgres@localhost:5432/job_tracker?schema=public` |
| `PORT`         | Port the API listens on                  | `4000`                                                                   |
| `CLIENT_URL`   | Allowed CORS origin (the frontend URL)   | `http://localhost:3000`                                                  |

**frontend/.env**

| Variable              | Description                  | Example                 |
| --------------------- | --------------------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API | `http://localhost:4000` |

## Installation

Install dependencies in both folders:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Database Migration Commands

Run these from the `backend` folder:

```bash
# generate the Prisma client
npm run prisma:generate

# create the database tables
npm run prisma:migrate

# (optional) seed some sample data
npm run seed
```

## Running Backend

From the `backend` folder:

```bash
npm run dev
```

The API will be available at `http://localhost:4000`.

## Running Frontend

From the `frontend` folder:

```bash
npm run dev
```

The app will be available at `http://localhost:3000` and redirects to `/applications`.

## Running Tests

From the `backend` folder:

```bash
npm test
```

This runs the Jest unit test for the application validator.

## API Documentation

Base URL: `http://localhost:4000`

### GET /applications

Returns a paginated list of applications.

Query parameters (all optional):

| Param    | Description                                            |
| -------- | ----------------------------------------------------- |
| `status` | Filter by status: `Applied`, `Interviewing`, `Offer`, `Rejected` |
| `search` | Search by company name or job title                   |
| `page`   | Page number (default `1`)                             |
| `limit`  | Items per page (default `10`, max `100`)              |

Example: `GET /applications?status=Applied&search=google&page=1`

Response:

```json
{
  "data": [
    {
      "id": "uuid",
      "companyName": "Google",
      "jobTitle": "Frontend Intern",
      "jobType": "Internship",
      "status": "Applied",
      "appliedDate": "2026-05-10T00:00:00.000Z",
      "notes": "Applied through the careers portal.",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

### GET /applications/:id

Returns a single application, or `404` if it doesn't exist.

### POST /applications

Creates an application.

Request body:

```json
{
  "companyName": "Google",
  "jobTitle": "Frontend Intern",
  "jobType": "Internship",
  "status": "Applied",
  "appliedDate": "2026-05-10",
  "notes": "Optional note"
}
```

Returns `201` with the created application. Validation errors return `400`.

### PATCH /applications/:id

Updates an application. Any subset of the fields above can be sent. Returns the updated record, or
`404` if the id doesn't exist.

### DELETE /applications/:id

Deletes an application. Returns `204` on success, `404` if it doesn't exist.

## Running with Docker

From the project root:

```bash
docker-compose up --build
```

This starts PostgreSQL, the backend (which runs migrations on startup), and the frontend:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000`
- Database: `localhost:5432`
