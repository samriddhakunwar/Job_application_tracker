-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('Internship', 'FullTime', 'PartTime');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Applied', 'Interviewing', 'Offer', 'Rejected');

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "jobType" "JobType" NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'Applied',
    "appliedDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);
