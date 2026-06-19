import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import {
  CreateApplicationInput,
  UpdateApplicationInput,
  ListQuery,
} from '../validators/application.validator';

export async function getApplications(query: ListQuery) {
  const { status, search, page, limit } = query;

  const where: Prisma.ApplicationWhereInput = {};

  if (status) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { companyName: { contains: search, mode: 'insensitive' } },
      { jobTitle: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.application.findMany({
      where,
      orderBy: { appliedDate: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.application.count({ where }),
  ]);

  return {
    data: items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getApplicationById(id: string) {
  return prisma.application.findUnique({ where: { id } });
}

export async function createApplication(data: CreateApplicationInput) {
  return prisma.application.create({ data });
}

export async function updateApplication(id: string, data: UpdateApplicationInput) {
  return prisma.application.update({ where: { id }, data });
}

export async function deleteApplication(id: string) {
  return prisma.application.delete({ where: { id } });
}
